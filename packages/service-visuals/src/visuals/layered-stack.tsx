import * as THREE from 'three';

import { wireframeFromGeometry } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const LAYER_COUNT = 4;
const BASE_GAP = 0.34;
const FOCUS_GAP = 0.56;

/** Custom Software — flat panes stacked like a system's own layers. */
export const buildLayeredStack: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	group.rotation.x = -0.32;
	scene.add(group);

	const layers = Array.from({ length: LAYER_COUNT }, (unused, index) => {
		const geometry = new THREE.BoxGeometry(
			1.7 - index * 0.12,
			0.05,
			1.05 - index * 0.08
		);
		const color = index === 0 ? accent : ink;
		const layer = wireframeFromGeometry(
			geometry,
			color,
			index === 0 ? 0.9 : 0.42 + index * 0.05
		);
		group.add(layer);
		return layer;
	});

	let gap = BASE_GAP;

	return {
		update: (elapsed, focused) => {
			gap += ((focused ? FOCUS_GAP : BASE_GAP) - gap) * 0.06;

			layers.forEach((layer, index) => {
				layer.position.y = index * gap - (LAYER_COUNT - 1) * gap * 0.5;
			});

			group.rotation.y = elapsed * 0.18;
		},
		dispose: () => {
			layers.forEach((layer) => {
				layer.geometry.dispose();
				(layer.material as THREE.Material).dispose();
			});
		}
	};
};
