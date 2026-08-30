import * as THREE from 'three';

import { wireframeFromGeometry, centerGroup } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const CYCLE = 3;

/**
 * Shopify App Development — a module descending into a platform and seating.
 * The platform is fixed; what you add to it is the work.
 */
export const buildPluginSocket: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	group.rotation.set(-0.34, 0.5, 0);
	scene.add(group);

	const platform = wireframeFromGeometry(
		new THREE.BoxGeometry(1.9, 0.16, 1.3, 3, 1, 2),
		ink,
		0.45
	);
	platform.position.y = -0.5;
	group.add(platform);

	// The empty bay the module drops into.
	const socket = wireframeFromGeometry(
		new THREE.BoxGeometry(0.62, 0.1, 0.62),
		accent,
		0.35
	);
	socket.position.y = -0.4;
	group.add(socket);

	const plugin = wireframeFromGeometry(
		new THREE.BoxGeometry(0.56, 0.5, 0.56),
		accent,
		0.9
	);
	group.add(plugin);

	centerGroup(group);

	return {
		update: (elapsed, focused) => {
			const cycle = focused ? CYCLE * 0.62 : CYCLE;
			const t = (elapsed % cycle) / cycle;

			// Hover, drop, seat, hold — then lift and repeat.
			const drop = t < 0.55 ? t / 0.55 : 1;
			const eased = drop * drop * (3 - 2 * drop);
			const lift = t > 0.85 ? (t - 0.85) / 0.15 : 0;

			plugin.position.y = 0.75 - eased * 1 + lift * 1;
			plugin.rotation.y = (1 - eased) * 0.6;

			const seated = t > 0.55 && t < 0.85;
			(socket.material as THREE.LineBasicMaterial).opacity = seated
				? 0.9
				: 0.28;
			(platform.material as THREE.LineBasicMaterial).opacity = seated
				? 0.7
				: 0.4;

			group.rotation.y = 0.5 + Math.sin(elapsed * 0.22) * 0.18;
		},
		dispose: () => {
			[platform, socket, plugin].forEach((part) => {
				part.geometry.dispose();
				(part.material as THREE.Material).dispose();
			});
		}
	};
};
