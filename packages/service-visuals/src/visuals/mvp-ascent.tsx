import * as THREE from 'three';

import { wireframeFromGeometry, centerGroup } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const STEPS = 4;

/**
 * MVP Development — the first step built solid, the rest of the climb only
 * sketched behind it. A light walks the staircase: the v1 is what ships, not
 * the whole plan.
 */
export const buildMvpAscent: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	group.rotation.set(-0.22, 0.55, 0);
	scene.add(group);

	const steps = Array.from({ length: STEPS }, (unused, index) => {
		const step = wireframeFromGeometry(
			new THREE.BoxGeometry(0.62, 0.26, 0.62),
			index === 0 ? accent : ink,
			index === 0 ? 0.95 : 0.35
		);

		step.position.set(index * 0.5 - 0.75, index * 0.32 - 0.55, 0);
		group.add(step);
		return step;
	});

	const trail = new THREE.Line(
		new THREE.BufferGeometry().setFromPoints(
			steps.map((step) => step.position.clone())
		),
		new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0.3
		})
	);
	group.add(trail);

	centerGroup(group);

	return {
		update: (elapsed, focused) => {
			const head = (elapsed * (focused ? 1.5 : 0.7)) % (STEPS + 1.2);

			steps.forEach((step, index) => {
				const material = step.material as THREE.LineBasicMaterial;
				const nearness = Math.max(0, 1 - Math.abs(head - index));

				material.opacity = (index === 0 ? 0.55 : 0.22) + nearness * 0.6;
				step.scale.setScalar(1 + nearness * 0.07);
			});

			group.rotation.y = 0.55 + Math.sin(elapsed * 0.25) * 0.16;
		},
		dispose: () => {
			steps.forEach((step) => {
				step.geometry.dispose();
				(step.material as THREE.Material).dispose();
			});
			trail.geometry.dispose();
			(trail.material as THREE.Material).dispose();
		}
	};
};
