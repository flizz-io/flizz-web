import * as THREE from 'three';

import { wireframeFromGeometry } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

/** Custom Software (platform-scale) — a subdivided volumetric scaffold. */
export const buildGridLattice: ServiceVisualBuilder = (scene, { accent }) => {
	const lattice = wireframeFromGeometry(
		new THREE.BoxGeometry(1.5, 1.5, 1.5, 3, 3, 3),
		accent,
		0.55
	);
	scene.add(lattice);

	const material = lattice.material as THREE.LineBasicMaterial;

	return {
		update: (elapsed, focused) => {
			const speed = focused ? 0.5 : 0.22;
			lattice.rotation.x = elapsed * speed * 0.7;
			lattice.rotation.y = elapsed * speed;
			material.opacity = focused ? 0.85 : 0.55;
		},
		dispose: () => {
			lattice.geometry.dispose();
			material.dispose();
		}
	};
};
