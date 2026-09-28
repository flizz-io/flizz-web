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

// Drag to turn. The drag rotates the whole constellation about the screen's
// own axes, so it goes whichever way the hand moves — any direction, over the
// top as well as around.
const DRAG_RADIANS_PER_PX = 0.008;
// How quickly the turn catches up with the hand, per second: high enough to
// feel attached, low enough that a jerky drag still reads as a glide.
const DRAG_FOLLOW = 14;
// After release the turn carries on at the hand's speed and bleeds off at
// this rate per second — lower glides for longer.
const GLIDE_DECAY = 2.4;
/** Release this long after the hand stopped and nothing carries on. */
const RELEASE_STILL_MS = 90;
/** Share of each new drag sample in the running velocity. */
const VELOCITY_BLEND = 0.35;
// The idle turn, in rad/s. It hands over entirely while someone is turning
// or pointing at the scene, and eases back once they have left it alone.
const IDLE_SPIN = 0.16;
const IDLE_RETURN_MS = 2400;
const IDLE_HANDOVER_RATE = 2;
// Hover: a node counts as pointed at within this many px of its hub, or
// anywhere over its label. Emphasis eases in at this rate per second.
const HOVER_RADIUS = 44;
// The grab hand only appears once the pointer has rested on the scene this
// long — an invitation for someone lingering, not a cursor that flickers
// under everyone just passing over.
const GRAB_HINT_DELAY_MS = 1500;
const ACTIVE_EASE_RATE = 8;
const ACTIVE_HUB_GROWTH = 0.45;
const ACTIVE_POINT_GROWTH = 0.3;
const EDGE_OPACITY = 0.22;
const ACTIVE_EDGE_OPACITY = 0.75;
const POINT_OPACITY = 0.7;
const ACTIVE_POINT_OPACITY = 1;
/** Longest frame step counted, so a paused loop doesn't jump on resume. */
const MAX_FRAME_SECONDS = 0.1;
const TILT_SWING = 0.1;

// Size controls are expressed 0–100 with 50 held at the size the scene was
// composed for, so a caller tunes it the way a slider reads rather than having
// to know what multiplier the geometry expects.
const SCALE_CONTROL_MIDPOINT = 50;
const MIN_SCENE_FACTOR = 0.35;
const MIN_CENTER_FACTOR = 0.2;
const MAX_CENTER_FACTOR = 3;

// The top of both dials is measured against the frame rather than pinned to a
// number, so no setting can push the artwork out through the edges. The drag
// can leave it facing any way at all, so the silhouette is bounded by a sphere
// and sampled over a full turn and tilt.
const FIT_ROTATION_STEPS = 24;
const FIT_TILT_LEAN = [-0.4, 0, 0.4];

const WORLD_X = new THREE.Vector3(1, 0, 0);
const WORLD_Y = new THREE.Vector3(0, 1, 0);

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

// Share of the node clearance a label may still overlap before it counts as
// sitting on its node and swings to another side.
const LABEL_OVERLAP_ALLOWANCE = 0.5;

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
	/**
	 * Called once the scene has drawn its first frame at a real size (or
	 * found there is no WebGL to draw with) — what a loader waits on.
	 */
	onReady?: () => void;
}

export function HeroDisciplinesScene({
	centerObject = 'pulse-orb',
	sceneScale = SCALE_CONTROL_MIDPOINT,
	centerObjectScale = SCALE_CONTROL_MIDPOINT,
	labelFontSize = DEFAULT_LABEL_FONT_SIZE,
	captionFontSize = DEFAULT_CAPTION_FONT_SIZE,
	clusterPointCount = DEFAULT_CLUSTER_POINTS,
	hasDisciplineBg = true,
	onReady
}: HeroDisciplinesSceneProps = {}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
	const labelSizesRef = useRef<{ width: number; height: number }[]>([]);
	// Latest callback without re-running the scene effect when it changes.
	const onReadyRef = useRef(onReady);
	const readyReportedRef = useRef(false);
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
		onReadyRef.current = onReady;
	}, [onReady]);

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
			// No WebGL — the labels still render as a plain list, and there is
			// nothing more to wait for.
			if (!readyReportedRef.current) {
				readyReportedRef.current = true;
				onReadyRef.current?.();
			}
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

		// The hand's turn lives on a parent of the composed scene, so the
		// resting tilt and idle turn below keep working inside whatever
		// orientation the drag has left it in.
		const turntable = new THREE.Group();
		scene.add(turntable);

		const group = new THREE.Group();
		group.rotation.x = BASE_TILT;
		turntable.add(group);

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

		// --- drag to turn, hover to focus -------------------------------------
		// A drag queues rotation into `pending`, which each frame drains into
		// the turntable a share at a time — so the turn follows the hand with
		// a little weight instead of snapping to every sample. On release the
		// hand's speed keeps feeding `pending` and decays, which is the glide.
		const pending = { x: 0, y: 0 };
		const velocity = { x: 0, y: 0 };
		const drag = { active: false, lastX: 0, lastY: 0, lastAt: 0 };
		const pointer = { x: 0, y: 0, inside: false };
		let lastInteractionAt = -Infinity;
		let activeIndex = -1;

		const readPointer = (event: PointerEvent) => {
			const rect = container.getBoundingClientRect();
			pointer.x = event.clientX - rect.left;
			pointer.y = event.clientY - rect.top;
		};

		let grabHintTimer: number | null = null;

		const clearGrabHint = () => {
			if (grabHintTimer !== null) {
				window.clearTimeout(grabHintTimer);
				grabHintTimer = null;
			}
			delete container.dataset.grabHint;
		};

		// Any movement puts the regular cursor back and restarts the wait.
		const scheduleGrabHint = () => {
			clearGrabHint();
			grabHintTimer = window.setTimeout(() => {
				grabHintTimer = null;
				container.dataset.grabHint = 'true';
			}, GRAB_HINT_DELAY_MS);
		};

		const onPointerDown = (event: PointerEvent) => {
			if (event.pointerType === 'mouse' && event.button !== 0) return;

			drag.active = true;
			drag.lastX = event.clientX;
			drag.lastY = event.clientY;
			drag.lastAt = event.timeStamp;
			// Grabbing a gliding scene catches it.
			velocity.x = 0;
			velocity.y = 0;
			lastInteractionAt = performance.now();
			container.setPointerCapture(event.pointerId);
			clearGrabHint();
			container.dataset.dragging = 'true';
		};

		const onPointerMove = (event: PointerEvent) => {
			readPointer(event);
			pointer.inside = true;
			if (drag.active) clearGrabHint();
			else scheduleGrabHint();

			if (drag.active) {
				const turnX =
					(event.clientX - drag.lastX) * DRAG_RADIANS_PER_PX;
				const turnY =
					(event.clientY - drag.lastY) * DRAG_RADIANS_PER_PX;
				const seconds =
					Math.max(event.timeStamp - drag.lastAt, 1) / 1000;

				pending.x += turnX;
				pending.y += turnY;
				velocity.x += (turnX / seconds - velocity.x) * VELOCITY_BLEND;
				velocity.y += (turnY / seconds - velocity.y) * VELOCITY_BLEND;

				drag.lastX = event.clientX;
				drag.lastY = event.clientY;
				drag.lastAt = event.timeStamp;
				lastInteractionAt = performance.now();
			}

			if (prefersReducedMotion) renderStill();
		};

		const onPointerUp = (event: PointerEvent) => {
			if (!drag.active) return;

			drag.active = false;
			delete container.dataset.dragging;
			// Let go and left resting: the hand comes back after the same wait.
			scheduleGrabHint();
			if (container.hasPointerCapture(event.pointerId)) {
				container.releasePointerCapture(event.pointerId);
			}

			// Held still before letting go: set it down rather than fling it.
			if (event.timeStamp - drag.lastAt > RELEASE_STILL_MS) {
				velocity.x = 0;
				velocity.y = 0;
			}
		};

		const onPointerLeave = () => {
			if (drag.active) return;

			clearGrabHint();
			pointer.inside = false;
			if (prefersReducedMotion) renderStill();
		};

		container.addEventListener('pointerdown', onPointerDown);
		container.addEventListener('pointermove', onPointerMove);
		container.addEventListener('pointerup', onPointerUp);
		container.addEventListener('pointercancel', onPointerUp);
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
			opacity: POINT_OPACITY,
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

			// Its own copy, so one cluster can light up without the others.
			const cloudMaterial = clusterMaterial.clone();
			const cloud = new THREE.Points(geometry, cloudMaterial);
			group.add(cloud);

			const hub = new THREE.Mesh(
				new THREE.SphereGeometry(0.075, 12, 12),
				new THREE.MeshBasicMaterial({ color: accent })
			);
			hub.position.copy(anchor);
			group.add(hub);

			return { cloud, cloudMaterial, hub };
		});

		// How lit each discipline is, 0 → 1, eased toward whichever is hovered.
		const emphasis = anchors.map(() => 0);

		// --- edges: core to each node, and node to node ---------------------
		// Each edge remembers the disciplines it touches, so hovering one
		// lights its own connections.
		const edges: {
			from: THREE.Vector3;
			to: THREE.Vector3;
			nodes: number[];
		}[] = [];
		anchors.forEach((anchor, index) => {
			edges.push({
				from: new THREE.Vector3(),
				to: anchor,
				nodes: [index]
			});
			const nextIndex = (index + 1) % anchors.length;
			const next = anchors[nextIndex];
			if (next) {
				edges.push({
					from: anchor,
					to: next,
					nodes: [index, nextIndex]
				});
			}
		});

		const edgeMaterial = new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: EDGE_OPACITY
		});
		const edgeLines = edges.map((edge) => {
			const line = new THREE.Line(
				new THREE.BufferGeometry().setFromPoints([edge.from, edge.to]),
				edgeMaterial.clone()
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

		// The silhouette to keep in frame: a sphere through the furthest
		// cluster's outer halo, since the drag can turn any of them to face
		// any way.
		const constellationRadius =
			Math.max(...anchors.map((anchor) => anchor.length())) +
			CLUSTER_HALO_RADIUS;
		const constellationSamples = FIT_DIRECTIONS.map((direction) =>
			direction.clone().multiplyScalar(constellationRadius)
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

			if (!readyReportedRef.current) {
				readyReportedRef.current = true;
				onReadyRef.current?.();
			}
		};

		const projected = new THREE.Vector3();
		// Where each hub and label landed on screen last placement, for hover.
		const hubsOnScreen = anchors.map(() => ({ x: 0, y: 0 }));
		const labelsOnScreen = anchors.map(() => ({
			x: 0,
			y: 0,
			halfWidth: 0,
			halfHeight: 0
		}));

		// Which side of its node each label last settled on.
		const labelSides = anchors.map(() => 0);

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
				const clearance = NODE_CLEARANCE * sceneFactor;

				// Held inside the frame, or a node swinging wide throws its
				// label past the square the scene is drawn in.
				const placeAlong = (towardX: number, towardY: number) => {
					const push =
						clearance +
						Math.abs(towardX) * halfWidth +
						Math.abs(towardY) * halfHeight;

					return {
						x: clamp(
							screenX + towardX * push,
							halfWidth,
							clientWidth - halfWidth
						),
						y: clamp(
							screenY + towardY * push,
							halfHeight,
							clientHeight - halfHeight
						)
					};
				};

				// Holding it inside the frame can drag the block straight back
				// over its own node near an edge, burying the words under the
				// points. When that happens it swings to the next side that
				// stays clear — keeping whichever side it was already on while
				// that still works, so it doesn't flicker between them.
				const clearsNode = (spot: { x: number; y: number }) =>
					Math.abs(spot.x - screenX) >=
						halfWidth + clearance * LABEL_OVERLAP_ALLOWANCE ||
					Math.abs(spot.y - screenY) >=
						halfHeight + clearance * LABEL_OVERLAP_ALLOWANCE;

				const sides: [number, number][] = [
					[directionX, directionY],
					[0, -1],
					[0, 1],
					[-Math.sign(directionX) || -1, 0]
				];
				const preferred = labelSides[index] ?? 0;
				const order = [
					preferred,
					...sides
						.map((_, side) => side)
						.filter((side) => side !== preferred)
				];
				// Nowhere clear at all falls back to the outward push.
				let chosen = 0;
				let placed = placeAlong(directionX, directionY);

				for (const side of order) {
					const [towardX, towardY] = sides[side] ?? [
						directionX,
						directionY
					];
					const spot = placeAlong(towardX, towardY);
					if (clearsNode(spot)) {
						chosen = side;
						placed = spot;
						break;
					}
				}

				labelSides[index] = chosen;
				const placedX = placed.x;
				const placedY = placed.y;

				hubsOnScreen[index] = { x: screenX, y: screenY };
				labelsOnScreen[index] = {
					x: placedX,
					y: placedY,
					halfWidth,
					halfHeight
				};

				label.style.transform = `translate(-50%, -50%) translate(${placedX}px, ${placedY}px)`;
				// A hovered label comes fully forward wherever its node is.
				label.style.opacity =
					index === activeIndex
						? '1'
						: String(
								LABEL_MIN_OPACITY +
									clamp(depth, 0, 1) * (1 - LABEL_MIN_OPACITY)
							);
			});
		};

		const findHovered = () => {
			if (!pointer.inside || drag.active) return -1;

			let found = -1;
			let nearest = HOVER_RADIUS;

			anchors.forEach((unused, index) => {
				const label = labelsOnScreen[index];
				const hub = hubsOnScreen[index];
				if (!label || !hub) return;

				if (
					Math.abs(pointer.x - label.x) <= label.halfWidth &&
					Math.abs(pointer.y - label.y) <= label.halfHeight
				) {
					found = index;
					nearest = 0;
					return;
				}

				const distance = Math.hypot(
					pointer.x - hub.x,
					pointer.y - hub.y
				);
				if (distance < nearest) {
					nearest = distance;
					found = index;
				}
			});

			return found;
		};

		const updateHover = () => {
			const next = findHovered();
			if (next === activeIndex) return;

			activeIndex = next;
			labelRefs.current.forEach((label, index) => {
				if (!label) return;
				if (index === activeIndex) label.dataset.active = 'true';
				else delete label.dataset.active;
			});
		};

		/** Eases each discipline's emphasis and applies it to the scene. */
		const applyEmphasis = (step: number, elapsed: number) => {
			const ease = step > 0 ? 1 - Math.exp(-step * ACTIVE_EASE_RATE) : 1;

			clusters.forEach(({ cloudMaterial, hub }, index) => {
				const wanted = index === activeIndex ? 1 : 0;
				const lit =
					(emphasis[index] ?? 0) +
					(wanted - (emphasis[index] ?? 0)) * ease;
				emphasis[index] = lit;

				const pulse = 1 + Math.sin(elapsed * 1.6 + index * 2.1) * 0.22;
				hub.scale.setScalar(pulse * (1 + lit * ACTIVE_HUB_GROWTH));
				cloudMaterial.opacity =
					POINT_OPACITY +
					lit * (ACTIVE_POINT_OPACITY - POINT_OPACITY);
				cloudMaterial.size =
					clusterMaterial.size * (1 + lit * ACTIVE_POINT_GROWTH);
			});

			edgeLines.forEach((line, edgeIndex) => {
				const lit = Math.max(
					0,
					...(edges[edgeIndex]?.nodes ?? []).map(
						(node) => emphasis[node] ?? 0
					)
				);
				(line.material as THREE.LineBasicMaterial).opacity =
					EDGE_OPACITY + lit * (ACTIVE_EDGE_OPACITY - EDGE_OPACITY);
			});
		};

		/**
		 * One frame on demand, for reduced motion: the loop never runs, so
		 * the drag turns the scene directly and each move redraws it.
		 */
		function renderStill() {
			turntable.rotateOnWorldAxis(WORLD_Y, pending.x);
			turntable.rotateOnWorldAxis(WORLD_X, pending.y);
			pending.x = 0;
			pending.y = 0;
			scene.updateMatrixWorld();
			placeLabels();
			updateHover();
			applyEmphasis(0, 0);
			placeLabels();
			renderer.render(scene, camera);
		}

		let animationFrame = 0;
		const start = performance.now();
		let lastFrameAt = start;
		// The idle turn accumulates rather than being derived from elapsed
		// time, so it can hand over to the hand and back without the angle
		// jumping.
		let spin = 0;
		let spinShare = 1;

		const draw = () => {
			const now = performance.now();
			const elapsed = (now - start) / 1000;
			const step = Math.min(
				(now - lastFrameAt) / 1000,
				MAX_FRAME_SECONDS
			);
			lastFrameAt = now;

			// Frame-rate independent throughout, so it feels the same at
			// 60Hz and 144Hz.
			if (!drag.active) {
				pending.x += velocity.x * step;
				pending.y += velocity.y * step;
				const decay = Math.exp(-step * GLIDE_DECAY);
				velocity.x *= decay;
				velocity.y *= decay;
			}

			const take = 1 - Math.exp(-step * DRAG_FOLLOW);
			const turnX = pending.x * take;
			const turnY = pending.y * take;
			pending.x -= turnX;
			pending.y -= turnY;
			turntable.rotateOnWorldAxis(WORLD_Y, turnX);
			turntable.rotateOnWorldAxis(WORLD_X, turnY);

			const engaged =
				drag.active ||
				activeIndex !== -1 ||
				now - lastInteractionAt < IDLE_RETURN_MS;
			spinShare +=
				((engaged ? 0 : 1) - spinShare) *
				(1 - Math.exp(-step * IDLE_HANDOVER_RATE));
			spin += IDLE_SPIN * spinShare * step;

			group.rotation.y = spin;
			group.rotation.x =
				BASE_TILT + Math.sin(elapsed * 0.22) * TILT_SWING;
			core.update(elapsed, pointer.inside);

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

			scene.updateMatrixWorld();
			placeLabels();
			updateHover();
			applyEmphasis(step, elapsed);
			renderer.render(scene, camera);
			reveal();
			animationFrame = requestAnimationFrame(draw);
		};

		const play = () => {
			if (animationFrame || prefersReducedMotion) return;
			lastFrameAt = performance.now();
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

			container.removeEventListener('pointerdown', onPointerDown);
			container.removeEventListener('pointermove', onPointerMove);
			container.removeEventListener('pointerup', onPointerUp);
			container.removeEventListener('pointercancel', onPointerUp);
			container.removeEventListener('pointerleave', onPointerLeave);
			clearGrabHint();
			core.dispose();
			clusterMaterial.dispose();
			clusters.forEach(({ cloud, cloudMaterial, hub }) => {
				cloud.geometry.dispose();
				cloudMaterial.dispose();
				hub.geometry.dispose();
				(hub.material as THREE.Material).dispose();
			});
			edgeLines.forEach((line) => {
				line.geometry.dispose();
				(line.material as THREE.Material).dispose();
			});
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
			// `touch-pan-y`: on touch a sideways drag turns the scene while an
			// upward one still scrolls the page.
			className="absolute inset-0 touch-pan-y select-none data-dragging:cursor-grabbing data-grab-hint:cursor-grab lg:top-12"
		>
			{heroDisciplines.map((discipline, index) => (
				<div
					key={discipline.label}
					ref={(node) => {
						labelRefs.current[index] = node;
					}}
					className={cn(
						'group pointer-events-none absolute top-0 left-0 w-max rounded-3xl p-3 text-center ring-1 ring-transparent transition-[opacity,scale,background-color,box-shadow] duration-500 ease-power-on',
						hasDisciplineBg && 'bg-primary/5',
						// Lit by the scene when its node or the block itself
						// is under the pointer.
						'data-active:z-10 data-active:scale-105 data-active:bg-background/85 data-active:shadow-[0_0_40px_-8px_var(--color-primary)] data-active:ring-primary/50 data-active:backdrop-blur-sm'
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
						className="mt-1.5 leading-snug text-foreground/80 transition-colors duration-500 group-data-active:text-foreground dark:text-white/80 dark:group-data-active:text-white"
						style={{ fontSize: `${captionFontSize}px` }}
					>
						{discipline.caption}
					</p>
				</div>
			))}
		</div>
	);
}
