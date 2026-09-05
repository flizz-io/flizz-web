'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

import { heroDisciplines } from '@/constants/home';
import { serviceVisualRegistry } from '@workspace/service-visuals';
import { useIsDarkTheme } from '@workspace/ui/hooks/use-is-dark-theme';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { useThemeColorVersion } from '@workspace/ui/hooks/use-theme-color-version';
import { readThemeColor } from '@workspace/ui/lib/css-color';
import { cn } from '@workspace/ui/lib/utils';

const MAX_PIXEL_RATIO = 2;
const THEMED_VARIABLES = ['--primary', '--foreground'];
const FALLBACK_ACCENT = '#8b5cf6';
const FALLBACK_INK = '#e7e4f0';

const NODE_RADIUS = 1.6;
const DEFAULT_CLUSTER_POINTS = 34;
const SIGNALS_PER_EDGE = 2;

// Widest a cluster's points scatter from their anchor. This is the outer edge
// of the silhouette, so it is what the frame actually has to hold.
const CLUSTER_HALO_RADIUS = 0.32;

// The resting tilt and its drift, shared by the animation and the fit
// measurement below so the two can never drift apart.
const BASE_TILT = -0.28;
const TILT_SWING = 0.1;

// Size controls are expressed 0–100 with 50 held at the size the scene was
// composed for, so a caller tunes it the way a slider reads rather than having
// to know what multiplier the geometry expects.
const SCALE_CONTROL_MIDPOINT = 50;
const MIN_SCENE_FACTOR = 0.35;
const MIN_CENTER_FACTOR = 0.2;
const MAX_CENTER_FACTOR = 3;

// The top of both dials is measured against the frame rather than pinned to a
// number, so no setting can push the artwork out through the edges. Sampled
// over a full turn because the constellation is widest side-on, and over the
// tilt the pointer can lean it to because that is not part of the turn.
const FIT_ROTATION_STEPS = 24;
const FIT_TILT_LEAN = [-0.4, 0, 0.4];

// The 26 corners, edges and faces of a cube: enough directions to bound a
// cluster halo or the centre object without sampling a whole sphere.
const FIT_DIRECTIONS = (() => {
	const directions: THREE.Vector3[] = [];

	for (let x = -1; x <= 1; x += 1) {
		for (let y = -1; y <= 1; y += 1) {
			for (let z = -1; z <= 1; z += 1) {
				if (x || y || z) {
					directions.push(new THREE.Vector3(x, y, z).normalize());
				}
			}
		}
	}

	return directions;
})();

// Radius of a cluster's halo on screen at the design scale — how far out a
// label has to start before it stops sitting on its own points.
const NODE_CLEARANCE = 40;

// A label on the far side of the turn still has to be readable, so the depth
// fade bottoms out well short of transparent.
const LABEL_MIN_OPACITY = 0.45;

// Large enough to read at a glance against the moving canvas behind them,
// rather than sized like a footnote on the artwork.
const DEFAULT_LABEL_FONT_SIZE = 13;
const DEFAULT_CAPTION_FONT_SIZE = 15;

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * Maps a 0–100 control onto a multiplier, pinned so that 50 is exactly 1 and
 * each half runs straight out to its own end of the range.
 */
function resolveScaleFactor(value: number, min: number, max: number): number {
	const clamped = clamp(value, 0, 100);

	return clamped <= SCALE_CONTROL_MIDPOINT
		? min + ((1 - min) * clamped) / SCALE_CONTROL_MIDPOINT
		: 1 +
				((max - 1) * (clamped - SCALE_CONTROL_MIDPOINT)) /
					SCALE_CONTROL_MIDPOINT;
}

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
	/**
	 * How large the whole constellation renders inside its frame, 0–100.
	 * 50 is the composed size; below shrinks it, above grows it.
	 */
	sceneScale?: number;
	/**
	 * How large the centre object renders relative to the rest, on the same
	 * 0–100 scale. Independent of `sceneScale`, so the core can be pulled back
	 * or pushed forward without resizing the clusters around it.
	 */
	centerObjectScale?: number;
	/** Discipline label size, in px. */
	labelFontSize?: number;
	/** Caption size under each label, in px. */
	captionFontSize?: number;
	/** How many points scatter around each discipline's hub. */
	clusterPointCount?: number;
	hasDisciplineBg?: boolean;
}

export function HeroDisciplinesScene({
	centerObject = 'pulse-orb',
	sceneScale = SCALE_CONTROL_MIDPOINT,
	centerObjectScale = SCALE_CONTROL_MIDPOINT,
	labelFontSize = DEFAULT_LABEL_FONT_SIZE,
	captionFontSize = DEFAULT_CAPTION_FONT_SIZE,
	clusterPointCount = DEFAULT_CLUSTER_POINTS,
	hasDisciplineBg = true
}: HeroDisciplinesSceneProps = {}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
	const labelSizesRef = useRef<{ width: number; height: number }[]>([]);
	const isDark = useIsDarkTheme();
	const prefersReducedMotion = usePrefersReducedMotion();
	const themeColorVersion = useThemeColorVersion(THEMED_VARIABLES);

	/**
	 * Levels the three blocks to the widest of them and hands the scene the
	 * boxes it places. Measured on demand rather than per frame: a label only
	 * ever gets a new transform and opacity, so reading its box inside the draw
	 * loop would force a layout flush every frame for a number that never moved.
	 */
	const measureLabels = useCallback(() => {
		const labels = labelRefs.current;

		// Back to their natural widths first, or a re-measure just reads back
		// the width the previous pass forced on them.
		labels.forEach((label) => {
			if (label) label.style.width = '';
		});

		const widest = labels.reduce(
			(max, label) => Math.max(max, label?.offsetWidth ?? 0),
			0
		);

		labelSizesRef.current = labels.map((label) => {
			if (!label) return { width: 0, height: 0 };

			label.style.width = `${widest}px`;
			return { width: widest, height: label.offsetHeight };
		});
	}, []);

	// Ahead of the scene below, so it measures blocks that have already been
	// levelled, and again whenever the type sizes change what widest means.
	useLayoutEffect(() => {
		measureLabels();
	}, [captionFontSize, labelFontSize, measureLabels]);

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
		// Hidden until the first frame drawn at a valid size. A canvas that is
		// visible before that can flash an uninitialised buffer, which is what
		// showed up as a blank block on a cold load.
		renderer.domElement.style.opacity = '0';
		renderer.domElement.style.transition = 'opacity 400ms ease-out';

		const group = new THREE.Group();
		group.rotation.x = BASE_TILT;
		scene.add(group);

		// --- the core everything reports to --------------------------------
		// Held in its own scaled group so a borrowed specimen — built for a
		// square 192px card — sits inside the triangle rather than swallowing
		// it, and so both options expose the same update/dispose pair.
		const coreHolder = new THREE.Group();
		const coreBaseScale = centerObject === 'pulse-orb' ? 0.52 : 1;
		coreHolder.scale.setScalar(coreBaseScale);
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

		const pointsPerCluster = Math.max(0, Math.round(clusterPointCount));

		const clusters = anchors.map((anchor) => {
			const positions = new Float32Array(pointsPerCluster * 3);

			for (let index = 0; index < pointsPerCluster; index += 1) {
				const t = index / pointsPerCluster;
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

			const cloud = new THREE.Points(geometry, clusterMaterial);
			group.add(cloud);

			const hub = new THREE.Mesh(
				new THREE.SphereGeometry(0.075, 12, 12),
				new THREE.MeshBasicMaterial({ color: accent })
			);
			hub.position.copy(anchor);
			group.add(hub);

			return { cloud, hub };
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

		// --- what the frame allows ------------------------------------------
		// A sample at model position `p` lands exactly on the frame edge when
		// `scale * (|p.x| * focal / aspect + p.z) = distance`, so every sample
		// gives a closed-form ceiling and the tightest one is the scale the
		// frame can hold. Solved rather than searched, and re-solved on resize
		// because the aspect is part of it.
		const fitProbe = new THREE.Object3D();
		const fitPoint = new THREE.Vector3();

		const measureFitScale = (samples: THREE.Vector3[]) => {
			const focal = 1 / Math.tan((camera.fov * Math.PI) / 360);
			const distance = camera.position.z;
			let ceiling = Number.POSITIVE_INFINITY;

			for (let step = 0; step < FIT_ROTATION_STEPS; step += 1) {
				const phase = (step / FIT_ROTATION_STEPS) * Math.PI * 2;

				for (const lean of FIT_TILT_LEAN) {
					fitProbe.rotation.set(
						BASE_TILT + Math.sin(phase) * TILT_SWING + lean,
						phase,
						0
					);
					fitProbe.updateMatrix();

					for (const sample of samples) {
						fitPoint.copy(sample).applyMatrix4(fitProbe.matrix);

						const reachX =
							(Math.abs(fitPoint.x) * focal) / camera.aspect +
							fitPoint.z;
						if (reachX > 0) {
							ceiling = Math.min(ceiling, distance / reachX);
						}

						const reachY =
							Math.abs(fitPoint.y) * focal + fitPoint.z;
						if (reachY > 0) {
							ceiling = Math.min(ceiling, distance / reachY);
						}
					}
				}
			}

			return ceiling;
		};

		// The silhouette to keep in frame: every cluster at the outer edge of
		// its halo.
		const constellationSamples = anchors.flatMap((anchor) =>
			FIT_DIRECTIONS.map((direction) =>
				anchor.clone().addScaledVector(direction, CLUSTER_HALO_RADIUS)
			)
		);

		// Taken from what the registry actually built, so the centre dial is
		// capped by the real object rather than an assumed size. Measured while
		// the group is still unscaled, which is why the dials are applied after.
		const coreBounds = new THREE.Box3().setFromObject(coreHolder);
		const coreRadius = coreBounds.isEmpty()
			? 0
			: Math.max(coreBounds.max.length(), coreBounds.min.length());
		const coreSamples = FIT_DIRECTIONS.map((direction) =>
			direction.clone().multiplyScalar(coreRadius)
		);

		let sceneFactor = 1;

		const applyScales = () => {
			const sceneCeiling = measureFitScale(constellationSamples);
			sceneFactor = Math.min(
				sceneCeiling,
				resolveScaleFactor(sceneScale, MIN_SCENE_FACTOR, sceneCeiling)
			);
			group.scale.setScalar(sceneFactor);

			let centerFactor = resolveScaleFactor(
				centerObjectScale,
				MIN_CENTER_FACTOR,
				MAX_CENTER_FACTOR
			);

			// The core rides the group's scale too, so its own ceiling is what
			// is left of the frame once the constellation has taken its share.
			if (coreRadius > 0) {
				const coreCeiling = measureFitScale(coreSamples) / sceneFactor;
				centerFactor = Math.min(centerFactor, coreCeiling);
			}

			coreHolder.scale.setScalar(coreBaseScale * centerFactor);
		};

		let sized = false;

		const resize = () => {
			const { clientWidth, clientHeight } = container;
			if (!clientWidth || !clientHeight) return;

			camera.aspect = clientWidth / clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(clientWidth, clientHeight, false);
			applyScales();
			measureLabels();
			sized = true;
		};

		const reveal = () => {
			if (!sized) return;
			renderer.domElement.style.opacity = '1';
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
				// should fade rather than sit on top of it. Measured against the
				// scaled radius, or the fade would flatten out as the scene grows.
				const depthSpan = NODE_RADIUS * sceneFactor;
				const depth = (projected.z + depthSpan) / (depthSpan * 2);

				projected.project(camera);

				const screenX = (projected.x * 0.5 + 0.5) * clientWidth;
				const screenY = (-projected.y * 0.5 + 0.5) * clientHeight;

				// Pushed clear of its own cluster: sitting on the node put the
				// words straight over the points and neither could be read. The
				// block clears by its own half-extent along the way it travels, so
				// larger type moves further out instead of landing back on top.
				const outX = screenX - clientWidth / 2;
				const outY = screenY - clientHeight / 2;
				const reach = Math.hypot(outX, outY) || 1;
				const directionX = outX / reach;
				const directionY = outY / reach;

				const { width = 0, height = 0 } =
					labelSizesRef.current[index] ?? {};
				const halfWidth = width / 2;
				const halfHeight = height / 2;
				const push =
					NODE_CLEARANCE * sceneFactor +
					Math.abs(directionX) * halfWidth +
					Math.abs(directionY) * halfHeight;

				// Held inside the frame, or a node swinging wide throws its
				// label past the square the scene is drawn in.
				const placedX = clamp(
					screenX + directionX * push,
					halfWidth,
					clientWidth - halfWidth
				);
				const placedY = clamp(
					screenY + directionY * push,
					halfHeight,
					clientHeight - halfHeight
				);

				label.style.transform = `translate(-50%, -50%) translate(${placedX}px, ${placedY}px)`;
				label.style.opacity = String(
					LABEL_MIN_OPACITY +
						clamp(depth, 0, 1) * (1 - LABEL_MIN_OPACITY)
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
				BASE_TILT +
				Math.sin(elapsed * 0.22) * TILT_SWING +
				lean.y * 0.4;
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
			reveal();
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
		measureLabels();
		placeLabels();
		renderer.render(scene, camera);
		reveal();

		const observer = new IntersectionObserver(([entry]) =>
			entry?.isIntersecting ? play() : stop()
		);
		observer.observe(container);

		const onVisibilityChange = () => (document.hidden ? stop() : play());

		// The square box takes its height from its own width during layout, so
		// the first measurement can land before that resolves — a window
		// listener never sees it and the buffer stays the wrong shape.
		const resizeObserver = new ResizeObserver(() => {
			resize();
			placeLabels();
			renderer.render(scene, camera);
			reveal();
		});
		resizeObserver.observe(container);

		window.addEventListener('resize', resize);
		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			stop();
			observer.disconnect();
			resizeObserver.disconnect();
			window.removeEventListener('resize', resize);
			document.removeEventListener(
				'visibilitychange',
				onVisibilityChange
			);

			container.removeEventListener('pointermove', onPointerMove);
			container.removeEventListener('pointerleave', onPointerLeave);
			core.dispose();
			clusterMaterial.dispose();
			clusters.forEach(({ cloud, hub }) => {
				cloud.geometry.dispose();
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
	}, [
		centerObject,
		centerObjectScale,
		clusterPointCount,
		isDark,
		measureLabels,
		prefersReducedMotion,
		sceneScale,
		themeColorVersion
	]);

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
					className={cn(
						'pointer-events-none absolute top-0 left-0 w-max text-center transition-opacity duration-300',
						hasDisciplineBg && 'rounded-3xl bg-primary/5 p-3'
					)}
				>
					<p
						className="font-mono font-medium tracking-[0.16em] whitespace-nowrap text-primary uppercase"
						style={{ fontSize: `${labelFontSize}px` }}
					>
						{discipline.label}
					</p>
					{/* The caption used to sit on `muted-foreground`, which all but
					    disappeared against the canvas behind it — this holds its own
					    over both the dark field and the light one. */}
					<p
						className="mt-1.5 leading-snug text-foreground/80 dark:text-white/80"
						style={{ fontSize: `${captionFontSize}px` }}
					>
						{discipline.caption}
					</p>
				</div>
			))}
		</div>
	);
}
