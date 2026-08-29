import * as THREE from 'three';

import { circleOutline, wireframeFromGeometry } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const RING_COUNT = 3;
const CYCLE_SECONDS = 2.6;

/** Chatbots & Conversational AI — a rhythmic pulse, like a response landing. */
export const buildPulseOrb: ServiceVisualBuilder = (scene, { accent }) => {
	const orb = wireframeFromGeometry(
		new THREE.IcosahedronGeometry(0.6, 1),
		accent,
		0.85
	);
	scene.add(orb);
	const orbMaterial = orb.material as THREE.Material;

	const ringGeometry = circleOutline(1);
	const rings = Array.from({ length: RING_COUNT }, () => {
		const material = new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0
		});
		const ring = new THREE.LineLoop(ringGeometry, material);
		scene.add(ring);
		return ring;
	});

	return {
		update: (elapsed, focused) => {
			const cycle = focused ? CYCLE_SECONDS * 0.55 : CYCLE_SECONDS;

			orb.scale.setScalar(
				1 + 0.08 * Math.sin(elapsed * (focused ? 5 : 3))
			);
			orb.rotation.y = elapsed * 0.25;
			orb.rotation.x = elapsed * 0.12;

			rings.forEach((ring, index) => {
				const phase =
					((elapsed - index * (cycle / RING_COUNT)) % cycle) / cycle;
				const t = phase < 0 ? phase + 1 : phase;

				ring.scale.setScalar(0.5 + t * 1.3);
				(ring.material as THREE.LineBasicMaterial).opacity =
					(1 - t) * (focused ? 0.6 : 0.35);
			});
		},
		dispose: () => {
			orb.geometry.dispose();
			orbMaterial.dispose();
			ringGeometry.dispose();
			rings.forEach((ring) =>
				(ring.material as THREE.Material).dispose()
			);
		}
	};
};
