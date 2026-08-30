'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { heroDisciplines } from '@/constants/home';
import { serviceVisualRegistry } from '@workspace/service-visuals';
import { useIsDarkTheme } from '@workspace/ui/hooks/use-is-dark-theme';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { useThemeColorVersion } from '@workspace/ui/hooks/use-theme-color-version';
import { readThemeColor } from '@workspace/ui/lib/css-color';

const MAX_PIXEL_RATIO = 2;
const THEMED_VARIABLES = ['--primary', '--foreground'];
const FALLBACK_ACCENT = '#8b5cf6';
const FALLBACK_INK = '#e7e4f0';

const NODE_RADIUS = 1.6;
const CLUSTER_POINTS = 34;
const SIGNALS_PER_EDGE = 2;

/**
 * The three disciplines as one turning constellation: a core, three clusters
 * orbiting it, and traffic running along every edge between them.
 *
 * Deliberately built in depth rather than as a flat node diagram — the page
 * already uses flat graphs for the Problem scenes and the Solution blueprint,
 * so this earns its place by being something you rotate around rather than
 * read head-on. The labels are HTML projected onto their own node each frame,
 * which is what ties the words to the object instead of captioning it.
 */
interface HeroDisciplinesSceneProps {
	/**
	 * What sits at the centre of the constellation. `pulse-orb` borrows the
	 * specimen from the services palette; `icosahedron` is the plain wireframe
	 * core.
	 */
	centerObject?: 'pulse-orb' | 'icosahedron';
}

export function HeroDisciplinesScene({
	centerObject = 'pulse-orb'
}: HeroDisciplinesSceneProps = {}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
	const isDark = useIsDarkTheme();
	const prefersReducedMotion = usePrefersReducedMotion();
	const themeColorVersion = useThemeColorVersion(THEMED_VARIABLES);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true
			});
		} catch {
			// No WebGL — the labels still render as a plain list.
			return;
		}

		const accent = new THREE.Color(
			readThemeColor('--primary', FALLBACK_ACCENT)
		);
		const ink = new THREE.Color(
			readThemeColor('--foreground', FALLBACK_INK)
		);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
		camera.position.set(0, 0, 5.4);

		const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
		renderer.setPixelRatio(pixelRatio);
		renderer.setClearColor(0x000000, 0);
		container.append(renderer.domElement);
		renderer.domElement.style.width = '100%';
		renderer.domElement.style.height = '100%';

		const group = new THREE.Group();
		group.rotation.x = -0.28;
		scene.add(group);

		// --- the core everything reports to --------------------------------
		// Held in its own scaled group so a borrowed specimen — built for a
		// square 192px card — sits inside the triangle rather than swallowing
		// it, and so both options expose the same update/dispose pair.
		const coreHolder = new THREE.Group();
		coreHolder.scale.setScalar(centerObject === 'pulse-orb' ? 0.52 : 1);
		group.add(coreHolder);

		let core: {
			update: (elapsed: number, active: boolean) => void;
			dispose: () => void;
		};

		if (centerObject === 'pulse-orb') {
			core = serviceVisualRegistry['pulse-orb'].build(
				coreHolder,
				{ accent, ink },
				isDark
			);
		} else {
			const coreGeometry = new THREE.EdgesGeometry(
				new THREE.IcosahedronGeometry(0.42, 0)
			);
			const coreMaterial = new THREE.LineBasicMaterial({
				color: accent,
				transparent: true,
				opacity: 0.85
			});
			const wireframe = new THREE.LineSegments(
				coreGeometry,
				coreMaterial
			);
			coreHolder.add(wireframe);

			core = {
				update: (elapsed) => {
					wireframe.rotation.y = elapsed * 0.5;
					wireframe.rotation.x = elapsed * 0.3;
				},
				dispose: () => {
					coreGeometry.dispose();
					coreMaterial.dispose();
				}
			};
		}

		// --- pointer steering ------------------------------------------------
		// Target is where the pointer asks the constellation to face; `lean` is
		// what it has actually reached. Easing between them keeps the turn
		// weighted rather than snapping to the cursor.
		const target = { x: 0, y: 0 };
		const lean = { x: 0, y: 0 };
		let hovered = false;

		const onPointerMove = (event: PointerEvent) => {
			const rect = container.getBoundingClientRect();
			target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			target.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
			hovered = true;
		};

		const onPointerLeave = () => {
			target.x = 0;
			target.y = 0;
			hovered = false;
		};

		container.addEventListener('pointermove', onPointerMove);
		container.addEventListener('pointerleave', onPointerLeave);

		// --- one cluster per discipline, on a tilted triangle ---------------
		const anchors = heroDisciplines.map((unused, index) => {
			const angle = (index / heroDisciplines.length) * Math.PI * 2;
			return new THREE.Vector3(
				Math.cos(angle) * NODE_RADIUS,
				Math.sin(angle) * NODE_RADIUS * 0.55,
				Math.sin(angle) * NODE_RADIUS * 0.8
			);
		});

		const clusterMaterial = new THREE.PointsMaterial({
			color: ink,
			size: 0.05,
			transparent: true,
			opacity: 0.7,
			sizeAttenuation: true
		});

		const clusters = anchors.map((anchor) => {
			const positions = new Float32Array(CLUSTER_POINTS * 3);

			for (let index = 0; index < CLUSTER_POINTS; index += 1) {
				const t = index / CLUSTER_POINTS;
				const inclination = Math.acos(1 - 2 * t);
				const azimuth = Math.PI * 2 * 0.618034 * index;
				const radius = 0.16 + Math.random() * 0.16;

				positions[index * 3] =
					anchor.x +
					radius * Math.sin(inclination) * Math.cos(azimuth);
				positions[index * 3 + 1] =
					anchor.y +
					radius * Math.sin(inclination) * Math.sin(azimuth);
				positions[index * 3 + 2] =
					anchor.z + radius * Math.cos(inclination);
			}

			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute(
				'position',
				new THREE.BufferAttribute(positions, 3)
			);

			const points = new THREE.Points(geometry, clusterMaterial);
			group.add(points);

			const hub = new THREE.Mesh(
				new THREE.SphereGeometry(0.075, 12, 12),
				new THREE.MeshBasicMaterial({ color: accent })
			);
			hub.position.copy(anchor);
			group.add(hub);

			return { points, hub };
		});

		// --- edges: core to each node, and node to node ---------------------
		const edges: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
		anchors.forEach((anchor, index) => {
			edges.push({ from: new THREE.Vector3(), to: anchor });
			const next = anchors[(index + 1) % anchors.length];
			if (next) edges.push({ from: anchor, to: next });
		});

		const edgeMaterial = new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0.22
		});
		const edgeLines = edges.map((edge) => {
			const line = new THREE.Line(
				new THREE.BufferGeometry().setFromPoints([edge.from, edge.to]),
				edgeMaterial
			);
			group.add(line);
			return line;
		});

		// --- traffic running along those edges ------------------------------
		const signalCount = edges.length * SIGNALS_PER_EDGE;
		const signalPositions = new Float32Array(signalCount * 3);
		const signalGeometry = new THREE.BufferGeometry();
		signalGeometry.setAttribute(
			'position',
			new THREE.BufferAttribute(signalPositions, 3)
		);
		const signalMaterial = new THREE.PointsMaterial({
			color: accent,
			size: 0.11,
			transparent: true,
			opacity: 0.95,
			sizeAttenuation: true
		});
		const signals = new THREE.Points(signalGeometry, signalMaterial);
		group.add(signals);

		const offsets = Array.from({ length: signalCount }, () =>
			Math.random()
		);
		const speeds = Array.from(
			{ length: signalCount },
			() => 0.14 + Math.random() * 0.16
		);

		const resize = () => {
			const { clientWidth, clientHeight } = container;
			if (!clientWidth || !clientHeight) return;

			camera.aspect = clientWidth / clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(clientWidth, clientHeight, false);
		};

		const projected = new THREE.Vector3();

		const placeLabels = () => {
			const { clientWidth, clientHeight } = container;

			anchors.forEach((anchor, index) => {
				const label = labelRefs.current[index];
				if (!label) return;

				projected.copy(anchor);
				group.localToWorld(projected);

				// Depth before projecting: a node swinging behind the core
				// should fade rather than sit on top of it.
				const depth = (projected.z + NODE_RADIUS) / (NODE_RADIUS * 2);

				projected.project(camera);

				const screenX = (projected.x * 0.5 + 0.5) * clientWidth;
				const screenY = (-projected.y * 0.5 + 0.5) * clientHeight;

				// Pushed clear of its own cluster: sitting on the node put the
				// words straight over the points and neither could be read.
				const outX = screenX - clientWidth / 2;
				const outY = screenY - clientHeight / 2;
				const reach = Math.hypot(outX, outY) || 1;
				const push = 58;

				label.style.transform = `translate(-50%, -50%) translate(${
					screenX + (outX / reach) * push
				}px, ${screenY + (outY / reach) * push}px)`;
				label.style.opacity = String(
					0.25 + Math.min(1, Math.max(0, depth)) * 0.75
				);
			});
		};

		let animationFrame = 0;
		const start = performance.now();

		const draw = () => {
			const elapsed = (performance.now() - start) / 1000;

			lean.x += (target.x - lean.x) * 0.055;
			lean.y += (target.y - lean.y) * 0.055;

			group.rotation.y = elapsed * 0.16 + lean.x * 0.6;
			group.rotation.x =
				-0.28 + Math.sin(elapsed * 0.22) * 0.1 + lean.y * 0.4;
			core.update(elapsed, hovered);

			edges.forEach((edge, edgeIndex) => {
				for (let lane = 0; lane < SIGNALS_PER_EDGE; lane += 1) {
					const index = edgeIndex * SIGNALS_PER_EDGE + lane;
					const t =
						(elapsed * (speeds[index] ?? 0.2) +
							(offsets[index] ?? 0)) %
						1;

					signalPositions[index * 3] =
						edge.from.x + (edge.to.x - edge.from.x) * t;
					signalPositions[index * 3 + 1] =
						edge.from.y + (edge.to.y - edge.from.y) * t;
					signalPositions[index * 3 + 2] =
						edge.from.z + (edge.to.z - edge.from.z) * t;
				}
			});
			signalGeometry.attributes.position!.needsUpdate = true;

			clusters.forEach(({ hub }, index) => {
				hub.scale.setScalar(
					1 + Math.sin(elapsed * 1.6 + index * 2.1) * 0.22
				);
			});

			placeLabels();
			renderer.render(scene, camera);
			animationFrame = requestAnimationFrame(draw);
		};

		const play = () => {
			if (animationFrame || prefersReducedMotion) return;
			animationFrame = requestAnimationFrame(draw);
		};

		const stop = () => {
			if (!animationFrame) return;
			cancelAnimationFrame(animationFrame);
			animationFrame = 0;
		};

		resize();
		placeLabels();
		renderer.render(scene, camera);

		const observer = new IntersectionObserver(([entry]) =>
			entry?.isIntersecting ? play() : stop()
		);
		observer.observe(container);

		const onVisibilityChange = () => (document.hidden ? stop() : play());

		window.addEventListener('resize', resize);
		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			stop();
			observer.disconnect();
			window.removeEventListener('resize', resize);
			document.removeEventListener(
				'visibilitychange',
				onVisibilityChange
			);

			container.removeEventListener('pointermove', onPointerMove);
			container.removeEventListener('pointerleave', onPointerLeave);
			core.dispose();
			clusterMaterial.dispose();
			clusters.forEach(({ points, hub }) => {
				points.geometry.dispose();
				hub.geometry.dispose();
				(hub.material as THREE.Material).dispose();
			});
			edgeLines.forEach((line) => line.geometry.dispose());
			edgeMaterial.dispose();
			signalGeometry.dispose();
			signalMaterial.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, [centerObject, isDark, prefersReducedMotion, themeColorVersion]);

	return (
		<div
			ref={containerRef}
			className="absolute inset-0 lg:top-12"
		>
			{heroDisciplines.map((discipline, index) => (
				<div
					key={discipline.label}
					ref={(node) => {
						labelRefs.current[index] = node;
					}}
					className="pointer-events-none absolute top-0 left-0 w-max max-w-[9rem] text-center transition-opacity duration-300"
				>
					<p className="font-mono text-[0.6rem] tracking-[0.18em] text-primary uppercase">
						{discipline.label}
					</p>
					<p className="mt-1 text-[0.7rem] leading-snug text-muted-foreground">
						{discipline.caption}
					</p>
				</div>
			))}
		</div>
	);
}
