'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useIsDarkTheme } from '@workspace/ui/hooks/use-is-dark-theme';
import { readThemeColor } from '@workspace/ui/lib/css-color';

/**
 * The real cost, drawn as the gap between two trajectories: where the business
 * could be, and where its software lets it be. Value keeps rising out of the
 * gap and evaporating — the accent leaving the frame one particle at a time.
 */

const CURVE_POINTS = 760;
const GAP_PARTICLES = 1100;
const MAX_PIXEL_RATIO = 2;

// World units. The curves start together at the lower left and part company
// toward the right, where the copy mask leaves the frame open.
const FIELD_HEIGHT = 11;
const X_START = -8;
const X_END = 9;
const Y_ORIGIN = -3.4;
const Y_POTENTIAL_END = 3.6;
const Y_ACTUAL_END = -2.1;

const FALLBACK_ACCENT = '#8b5cf6';
const FALLBACK_INK = '#e7e4f0';

/** Compounding: the ground the business could have covered. */
function potentialY(u: number) {
	return Y_ORIGIN + (Y_POTENTIAL_END - Y_ORIGIN) * Math.pow(u, 1.6);
}

/** Near-linear, and flattening: what the tooling actually allows. */
function actualY(u: number) {
	return Y_ORIGIN + (Y_ACTUAL_END - Y_ORIGIN) * Math.pow(u, 0.9);
}

function worldX(u: number) {
	return X_START + (X_END - X_START) * u;
}

const vertexShader = /* glsl */ `
	attribute float aSize;
	attribute float aAlpha;
	attribute float aPhase;
	attribute vec3 aColor;

	uniform float uTime;
	uniform float uPixelRatio;

	varying float vAlpha;
	varying vec3 vColor;

	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		gl_PointSize = aSize * uPixelRatio;

		// A slow shimmer so the trajectories read as live readings rather than
		// a printed chart.
		vAlpha = aAlpha * (0.72 + 0.28 * sin(uTime * 1.1 + aPhase));
		vColor = aColor;
	}
`;

const fragmentShader = /* glsl */ `
	varying float vAlpha;
	varying vec3 vColor;

	void main() {
		float distanceToCenter = length(gl_PointCoord - vec2(0.5));
		float core = smoothstep(0.24, 0.0, distanceToCenter);
		float halo = smoothstep(0.5, 0.0, distanceToCenter) * 0.35;

		gl_FragColor = vec4(vColor, clamp(core + halo, 0.0, 1.0) * vAlpha);
	}
`;

export function CostScene({ active }: { active: boolean }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const isDark = useIsDarkTheme();
	const activeRef = useRef(active);
	const controlsRef = useRef<{ start: () => void; stop: () => void } | null>(
		null
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;

		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true,
				powerPreference: 'low-power'
			});
		} catch {
			// No WebGL — the stage still has its copy and its accent wash.
			return;
		}

		const accent = new THREE.Color(
			readThemeColor('--primary', FALLBACK_ACCENT)
		);
		const ink = new THREE.Color(
			readThemeColor('--foreground', FALLBACK_INK)
		);

		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(
			-10,
			10,
			5.5,
			-5.5,
			0.1,
			50
		);
		camera.position.z = 10;

		const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
		renderer.setPixelRatio(pixelRatio);
		renderer.setClearColor(0x000000, 0);
		container.append(renderer.domElement);
		renderer.domElement.style.width = '100%';
		renderer.domElement.style.height = '100%';

		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				uTime: { value: 0 },
				uPixelRatio: { value: pixelRatio }
			},
			transparent: true,
			depthWrite: false,
			// Additive glows on ink; on paper it would just bleach the page.
			blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
		});

		// --- the two trajectories -------------------------------------------
		const curveCount = CURVE_POINTS * 2;
		const curvePositions = new Float32Array(curveCount * 3);
		const curveColors = new Float32Array(curveCount * 3);
		const curveSizes = new Float32Array(curveCount);
		const curveAlphas = new Float32Array(curveCount);
		const curvePhases = new Float32Array(curveCount);

		for (let index = 0; index < CURVE_POINTS; index += 1) {
			const u = index / (CURVE_POINTS - 1);
			const pairs = [
				{ y: potentialY(u), color: accent, alpha: 1, size: 3.4 },
				{ y: actualY(u), color: ink, alpha: 0.5, size: 2.8 }
			];

			pairs.forEach((pair, pairIndex) => {
				const slot = index * 2 + pairIndex;

				curvePositions[slot * 3] = worldX(u);
				curvePositions[slot * 3 + 1] = pair.y;
				curvePositions[slot * 3 + 2] = 0;

				curveColors[slot * 3] = pair.color.r;
				curveColors[slot * 3 + 1] = pair.color.g;
				curveColors[slot * 3 + 2] = pair.color.b;

				// Brighter as the gap opens, so the eye is pulled rightward.
				curveSizes[slot] = pair.size;
				curveAlphas[slot] = pair.alpha * (0.35 + 0.65 * u);
				curvePhases[slot] = u * 9 + pairIndex * 2.1;
			});
		}

		const curveGeometry = new THREE.BufferGeometry();
		curveGeometry.setAttribute(
			'position',
			new THREE.BufferAttribute(curvePositions, 3)
		);
		curveGeometry.setAttribute(
			'aColor',
			new THREE.BufferAttribute(curveColors, 3)
		);
		curveGeometry.setAttribute(
			'aSize',
			new THREE.BufferAttribute(curveSizes, 1)
		);
		curveGeometry.setAttribute(
			'aAlpha',
			new THREE.BufferAttribute(curveAlphas, 1)
		);
		curveGeometry.setAttribute(
			'aPhase',
			new THREE.BufferAttribute(curvePhases, 1)
		);
		scene.add(new THREE.Points(curveGeometry, material));

		// --- value rising out of the gap and evaporating ---------------------
		const gapPositions = new Float32Array(GAP_PARTICLES * 3);
		const gapColors = new Float32Array(GAP_PARTICLES * 3);
		const gapSizes = new Float32Array(GAP_PARTICLES);
		const gapAlphas = new Float32Array(GAP_PARTICLES);
		const gapPhases = new Float32Array(GAP_PARTICLES);
		const gapU = new Float32Array(GAP_PARTICLES);
		const gapClimb = new Float32Array(GAP_PARTICLES);
		const gapSpeed = new Float32Array(GAP_PARTICLES);

		for (let index = 0; index < GAP_PARTICLES; index += 1) {
			// Biased right: there is barely any gap to leak from on the left.
			gapU[index] = Math.pow(Math.random(), 0.6);
			gapClimb[index] = Math.random();
			gapSpeed[index] = 0.05 + Math.random() * 0.07;
			gapSizes[index] = 1.6 + Math.random() * 2.2;
			gapPhases[index] = Math.random() * Math.PI * 2;

			gapColors[index * 3] = accent.r;
			gapColors[index * 3 + 1] = accent.g;
			gapColors[index * 3 + 2] = accent.b;
		}

		const gapGeometry = new THREE.BufferGeometry();
		gapGeometry.setAttribute(
			'position',
			new THREE.BufferAttribute(gapPositions, 3)
		);
		gapGeometry.setAttribute(
			'aColor',
			new THREE.BufferAttribute(gapColors, 3)
		);
		gapGeometry.setAttribute(
			'aSize',
			new THREE.BufferAttribute(gapSizes, 1)
		);
		gapGeometry.setAttribute(
			'aAlpha',
			new THREE.BufferAttribute(gapAlphas, 1)
		);
		gapGeometry.setAttribute(
			'aPhase',
			new THREE.BufferAttribute(gapPhases, 1)
		);
		scene.add(new THREE.Points(gapGeometry, material));

		const stepGapParticles = (delta: number) => {
			for (let index = 0; index < GAP_PARTICLES; index += 1) {
				gapClimb[index] =
					(gapClimb[index] ?? 0) + delta * (gapSpeed[index] ?? 0);

				if ((gapClimb[index] ?? 0) > 1) {
					gapClimb[index] = 0;
					gapU[index] = Math.pow(Math.random(), 0.6);
				}

				const u = gapU[index] ?? 0;
				const climb = gapClimb[index] ?? 0;
				const floorY = actualY(u);

				gapPositions[index * 3] = worldX(u);
				gapPositions[index * 3 + 1] =
					floorY + climb * (potentialY(u) - floorY);
				gapPositions[index * 3 + 2] = 0;

				// In at the floor, gone before it ever reaches the other line.
				gapAlphas[index] = Math.sin(climb * Math.PI) * 0.5;
			}

			gapGeometry.attributes.position!.needsUpdate = true;
			gapGeometry.attributes.aAlpha!.needsUpdate = true;
		};

		const resize = () => {
			const { clientWidth, clientHeight } = container;
			if (!clientWidth || !clientHeight) return;

			// Hold the chart's proportions and widen the view instead, so the
			// divergence never stretches with the viewport.
			const halfHeight = FIELD_HEIGHT / 2;
			const halfWidth = halfHeight * (clientWidth / clientHeight);

			camera.left = -halfWidth;
			camera.right = halfWidth;
			camera.top = halfHeight;
			camera.bottom = -halfHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(clientWidth, clientHeight, false);
		};

		let animationFrame = 0;
		let lastTime = performance.now();

		const render = () => {
			const now = performance.now();
			const delta = Math.min((now - lastTime) / 1000, 0.05);
			lastTime = now;

			material.uniforms.uTime!.value = now / 1000;
			stepGapParticles(delta);

			// A drift just large enough to keep the frame from feeling printed.
			camera.position.x = Math.sin(now / 9000) * 0.35;
			camera.position.y = Math.cos(now / 11000) * 0.2;

			renderer.render(scene, camera);
			animationFrame = requestAnimationFrame(render);
		};

		const start = () => {
			if (animationFrame || prefersReducedMotion || !activeRef.current) {
				return;
			}

			lastTime = performance.now();
			animationFrame = requestAnimationFrame(render);
		};

		const stop = () => {
			if (!animationFrame) return;
			cancelAnimationFrame(animationFrame);
			animationFrame = 0;
		};

		controlsRef.current = { start, stop };

		resize();
		stepGapParticles(0);
		material.uniforms.uTime!.value = performance.now() / 1000;
		renderer.render(scene, camera);

		const observer = new IntersectionObserver(([entry]) =>
			entry?.isIntersecting ? start() : stop()
		);
		observer.observe(container);

		const onVisibilityChange = () => (document.hidden ? stop() : start());

		window.addEventListener('resize', resize);
		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			stop();
			controlsRef.current = null;
			observer.disconnect();
			window.removeEventListener('resize', resize);
			document.removeEventListener(
				'visibilitychange',
				onVisibilityChange
			);

			curveGeometry.dispose();
			gapGeometry.dispose();
			material.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, [isDark]);

	// Held separate from the setup effect so becoming the active stage starts
	// the loop instead of rebuilding the whole scene.
	useEffect(() => {
		activeRef.current = active;

		if (active) {
			controlsRef.current?.start();
			return;
		}

		controlsRef.current?.stop();
	}, [active]);

	return (
		<div
			ref={containerRef}
			aria-hidden
			className="absolute inset-0"
		/>
	);
}
