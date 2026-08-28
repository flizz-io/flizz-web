'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { readThemeColor } from '@/utils/css-color';

const STAR_COUNT = 2200;
const COMET_COUNT = 2;
// Points are spaced tighter than their own radius so the tail reads as one
// continuous streak instead of a dotted line.
const COMET_TRAIL_POINTS = 60;
const COMET_TRAIL_SPACING = 0.06;
const MAX_PIXEL_RATIO = 2;

const FIELD_WIDTH = 30;
const FIELD_HEIGHT = 20;
// Kept well behind the camera (z = 6) so no star balloons into a bokeh blob.
const FIELD_DEPTH_NEAR = -3;
const FIELD_DEPTH_FAR = -24;

const HEAD_COLOR = new THREE.Color('#ffffff');
const FALLBACK_ACCENT = '#8b5cf6';

const starVertexShader = /* glsl */ `
	attribute float aSize;
	attribute float aPhase;
	attribute float aTwinkleSpeed;
	attribute vec3 aColor;

	uniform float uTime;
	uniform float uPixelRatio;

	varying float vAlpha;
	varying vec3 vColor;

	void main() {
		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * mvPosition;
		gl_PointSize = min(
			aSize * uPixelRatio * (60.0 / -mvPosition.z),
			5.0 * uPixelRatio
		);

		vAlpha = 0.55 + 0.45 * sin(uTime * aTwinkleSpeed + aPhase);
		vColor = aColor;
	}
`;

const cometVertexShader = /* glsl */ `
	attribute float aSize;
	attribute float aAlpha;
	attribute vec3 aColor;

	uniform float uPixelRatio;

	varying float vAlpha;
	varying vec3 vColor;

	void main() {
		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * mvPosition;
		gl_PointSize = aSize * uPixelRatio * (60.0 / -mvPosition.z);

		vAlpha = aAlpha;
		vColor = aColor;
	}
`;

const pointFragmentShader = /* glsl */ `
	varying float vAlpha;
	varying vec3 vColor;

	void main() {
		float distanceToCenter = length(gl_PointCoord - vec2(0.5));

		// Sharp core plus a faint halo reads as a star; a single soft falloff
		// reads as out-of-focus dust.
		float core = smoothstep(0.22, 0.0, distanceToCenter);
		float halo = smoothstep(0.5, 0.0, distanceToCenter) * 0.35;

		gl_FragColor = vec4(vColor, clamp(core + halo, 0.0, 1.0) * vAlpha);
	}
`;

interface Comet {
	position: THREE.Vector3;
	direction: THREE.Vector3;
	speed: number;
	life: number;
	maxLife: number;
	delay: number;
}

function createComet(): Comet {
	const goingRight = Math.random() > 0.5;

	return {
		position: new THREE.Vector3(
			goingRight
				? -FIELD_WIDTH / 2 - Math.random() * 4
				: FIELD_WIDTH / 2 + Math.random() * 4,
			FIELD_HEIGHT / 2 - Math.random() * FIELD_HEIGHT * 0.5,
			-4 - Math.random() * 8
		),
		direction: new THREE.Vector3(
			goingRight ? 1 : -1,
			-0.42 - Math.random() * 0.3,
			0
		).normalize(),
		speed: 7 + Math.random() * 6,
		life: 0,
		maxLife: 2.6 + Math.random() * 1.8,
		// Staggered so the two comets don't fall in lockstep on first load.
		delay: 2 + Math.random() * 12
	};
}

export function HeroScene() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;

		// Read the brand accent from CSS rather than duplicating the hex here,
		// so the scene follows the palette. Sampled once at setup: the colours
		// are baked into buffer attributes, so a live swap needs a remount.
		const TAIL_COLOR = new THREE.Color(
			readThemeColor('--primary', FALLBACK_ACCENT)
		);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			60,
			container.clientWidth / container.clientHeight,
			0.1,
			100
		);
		camera.position.z = 6;

		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: false,
				powerPreference: 'low-power'
			});
		} catch {
			// WebGL unavailable — the CSS gradient backdrop behind this canvas still renders.
			return;
		}

		const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
		renderer.setPixelRatio(pixelRatio);
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		// Stars
		const starPositions = new Float32Array(STAR_COUNT * 3);
		const starSizes = new Float32Array(STAR_COUNT);
		const starPhases = new Float32Array(STAR_COUNT);
		const starTwinkleSpeeds = new Float32Array(STAR_COUNT);
		const starColors = new Float32Array(STAR_COUNT * 3);

		const starColor = new THREE.Color();

		for (let i = 0; i < STAR_COUNT; i += 1) {
			starPositions[i * 3] = (Math.random() - 0.5) * FIELD_WIDTH;
			starPositions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_HEIGHT;
			starPositions[i * 3 + 2] =
				FIELD_DEPTH_NEAR +
				Math.random() * (FIELD_DEPTH_FAR - FIELD_DEPTH_NEAR);

			// Heavy skew toward tiny pinpoints, with a rare bright standout.
			starSizes[i] = 0.7 + Math.pow(Math.random(), 3.2) * 2.6;
			starPhases[i] = Math.random() * Math.PI * 2;
			starTwinkleSpeeds[i] = 0.4 + Math.random() * 1.5;

			// Mostly cool white, with a violet-tinted minority for brand depth.
			starColor
				.copy(HEAD_COLOR)
				.lerp(
					TAIL_COLOR,
					Math.random() < 0.3 ? Math.random() * 0.8 : 0
				);
			starColors[i * 3] = starColor.r;
			starColors[i * 3 + 1] = starColor.g;
			starColors[i * 3 + 2] = starColor.b;
		}

		const starGeometry = new THREE.BufferGeometry();
		starGeometry.setAttribute(
			'position',
			new THREE.BufferAttribute(starPositions, 3)
		);
		starGeometry.setAttribute(
			'aSize',
			new THREE.BufferAttribute(starSizes, 1)
		);
		starGeometry.setAttribute(
			'aPhase',
			new THREE.BufferAttribute(starPhases, 1)
		);
		starGeometry.setAttribute(
			'aTwinkleSpeed',
			new THREE.BufferAttribute(starTwinkleSpeeds, 1)
		);
		starGeometry.setAttribute(
			'aColor',
			new THREE.BufferAttribute(starColors, 3)
		);

		const starMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uPixelRatio: { value: pixelRatio }
			},
			vertexShader: starVertexShader,
			fragmentShader: pointFragmentShader,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		});

		const stars = new THREE.Points(starGeometry, starMaterial);
		scene.add(stars);

		// Comets
		const cometVertexCount = COMET_COUNT * COMET_TRAIL_POINTS;
		const cometPositions = new Float32Array(cometVertexCount * 3);
		const cometSizes = new Float32Array(cometVertexCount);
		const cometAlphas = new Float32Array(cometVertexCount);
		const cometColors = new Float32Array(cometVertexCount * 3);

		const cometGeometry = new THREE.BufferGeometry();
		cometGeometry.setAttribute(
			'position',
			new THREE.BufferAttribute(cometPositions, 3)
		);
		cometGeometry.setAttribute(
			'aSize',
			new THREE.BufferAttribute(cometSizes, 1)
		);
		cometGeometry.setAttribute(
			'aAlpha',
			new THREE.BufferAttribute(cometAlphas, 1)
		);
		cometGeometry.setAttribute(
			'aColor',
			new THREE.BufferAttribute(cometColors, 3)
		);

		const cometMaterial = new THREE.ShaderMaterial({
			uniforms: { uPixelRatio: { value: pixelRatio } },
			vertexShader: cometVertexShader,
			fragmentShader: pointFragmentShader,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		});

		const comets = Array.from({ length: COMET_COUNT }, createComet);
		const cometPoints = new THREE.Points(cometGeometry, cometMaterial);
		scene.add(cometPoints);

		const trailColor = new THREE.Color();
		const trailPosition = new THREE.Vector3();

		function updateComets(delta: number) {
			comets.forEach((comet, cometIndex) => {
				if (comet.delay > 0) {
					comet.delay -= delta;

					for (let i = 0; i < COMET_TRAIL_POINTS; i += 1) {
						cometAlphas[cometIndex * COMET_TRAIL_POINTS + i] = 0;
					}
					return;
				}

				comet.life += delta;
				comet.position.addScaledVector(
					comet.direction,
					comet.speed * delta
				);

				if (comet.life >= comet.maxLife) {
					Object.assign(comet, createComet(), {
						delay: 11 + Math.random() * 14
					});
					return;
				}

				const fadeIn = Math.min(comet.life / 0.4, 1);
				const fadeOut = Math.min((comet.maxLife - comet.life) / 0.9, 1);
				const lifeFade = fadeIn * fadeOut;

				for (let i = 0; i < COMET_TRAIL_POINTS; i += 1) {
					const vertexIndex = cometIndex * COMET_TRAIL_POINTS + i;
					const trailRatio = i / (COMET_TRAIL_POINTS - 1);

					trailPosition
						.copy(comet.position)
						.addScaledVector(
							comet.direction,
							-i * COMET_TRAIL_SPACING
						);

					cometPositions[vertexIndex * 3] = trailPosition.x;
					cometPositions[vertexIndex * 3 + 1] = trailPosition.y;
					cometPositions[vertexIndex * 3 + 2] = trailPosition.z;

					cometSizes[vertexIndex] = 1.9 * (1 - trailRatio) + 0.2;
					cometAlphas[vertexIndex] =
						Math.pow(1 - trailRatio, 2.1) * lifeFade;

					trailColor.copy(HEAD_COLOR).lerp(TAIL_COLOR, trailRatio);
					cometColors[vertexIndex * 3] = trailColor.r;
					cometColors[vertexIndex * 3 + 1] = trailColor.g;
					cometColors[vertexIndex * 3 + 2] = trailColor.b;
				}
			});

			cometGeometry.attributes.position!.needsUpdate = true;
			cometGeometry.attributes.aSize!.needsUpdate = true;
			cometGeometry.attributes.aAlpha!.needsUpdate = true;
			cometGeometry.attributes.aColor!.needsUpdate = true;
		}

		// Pointer parallax
		const pointer = { x: 0, y: 0 };
		const cameraTarget = { x: 0, y: 0 };

		function onPointerMove(event: PointerEvent) {
			pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
		}

		function onResize() {
			if (!container) return;

			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		}

		let animationFrame = 0;
		let isVisible = true;
		let elapsed = 0;
		let lastFrameTime = performance.now();

		function renderFrame() {
			const now = performance.now();
			const delta = Math.min((now - lastFrameTime) / 1000, 0.05);
			lastFrameTime = now;
			elapsed += delta;

			starMaterial.uniforms.uTime!.value = elapsed;
			stars.rotation.z += delta * 0.008;

			updateComets(delta);

			cameraTarget.x += (pointer.x * 0.45 - cameraTarget.x) * 0.035;
			cameraTarget.y += (-pointer.y * 0.3 - cameraTarget.y) * 0.035;
			camera.position.x = cameraTarget.x;
			camera.position.y = cameraTarget.y;
			camera.lookAt(0, 0, -6);

			renderer.render(scene, camera);
			animationFrame = window.requestAnimationFrame(renderFrame);
		}

		function start() {
			// Guarded here rather than at the call sites so nothing — including
			// the IntersectionObserver's initial callback — can start the loop
			// when the visitor asked for reduced motion.
			if (animationFrame || prefersReducedMotion) return;

			lastFrameTime = performance.now();
			animationFrame = window.requestAnimationFrame(renderFrame);
		}

		function stop() {
			if (!animationFrame) return;

			window.cancelAnimationFrame(animationFrame);
			animationFrame = 0;
		}

		function onVisibilityChange() {
			if (document.hidden || !isVisible) {
				stop();
			} else {
				start();
			}
		}

		// Only animate while the hero is actually on screen.
		const observer = new IntersectionObserver(
			([entry]) => {
				isVisible = entry?.isIntersecting ?? false;
				onVisibilityChange();
			},
			{ threshold: 0 }
		);
		observer.observe(container);

		if (prefersReducedMotion) {
			// Draw a single static frame — stars, no drift, no comets.
			updateComets(0);
			renderer.render(scene, camera);
		} else {
			start();
			window.addEventListener('pointermove', onPointerMove, {
				passive: true
			});
			document.addEventListener('visibilitychange', onVisibilityChange);
		}

		window.addEventListener('resize', onResize);

		return () => {
			stop();
			observer.disconnect();
			window.removeEventListener('resize', onResize);
			window.removeEventListener('pointermove', onPointerMove);
			document.removeEventListener(
				'visibilitychange',
				onVisibilityChange
			);

			starGeometry.dispose();
			starMaterial.dispose();
			cometGeometry.dispose();
			cometMaterial.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, []);

	return (
		<div
			ref={containerRef}
			aria-hidden
			className="absolute inset-0 -z-10"
		/>
	);
}
