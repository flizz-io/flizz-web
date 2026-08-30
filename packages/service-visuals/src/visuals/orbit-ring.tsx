import * as THREE from 'three';

import { circleOutline, wireframeFromGeometry } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const MARKER_COUNT = 3;
const ORBIT_RADIUS = 1;
const TILT = -0.9;

/** Online Store Development — listings orbiting a core catalogue item. */
export const buildOrbitRing: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	group.rotation.x = TILT;
	scene.add(group);

	const core = wireframeFromGeometry(
		new THREE.BoxGeometry(0.5, 0.5, 0.5),
		ink,
		0.75
	);
	group.add(core);

	const track = new THREE.LineLoop(
		circleOutline(ORBIT_RADIUS),
		new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0.35
		})
	);
	group.add(track);

	const markers = Array.from({ length: MARKER_COUNT }, (unused, index) => {
		const marker = new THREE.Mesh(
			new THREE.SphereGeometry(0.07, 10, 10),
			new THREE.MeshBasicMaterial({
				color: accent,
				transparent: true,
				opacity: 0.8
			})
		);
		marker.userData.offset = (index / MARKER_COUNT) * Math.PI * 2;
		group.add(marker);
		return marker;
	});

	return {
		update: (elapsed, focused) => {
			const speed = focused ? 0.75 : 0.32;

			markers.forEach((marker) => {
				const angle =
					elapsed * speed + (marker.userData.offset as number);
				marker.position.set(
					Math.cos(angle) * ORBIT_RADIUS,
					0,
					Math.sin(angle) * ORBIT_RADIUS
				);
				(marker.material as THREE.MeshBasicMaterial).opacity = focused
					? 1
					: 0.8;
			});

			group.rotation.z = Math.sin(elapsed * 0.2) * 0.08;
		},
		dispose: () => {
			core.geometry.dispose();
			(core.material as THREE.Material).dispose();
			track.geometry.dispose();
			(track.material as THREE.Material).dispose();
			markers.forEach((marker) => {
				marker.geometry.dispose();
				(marker.material as THREE.Material).dispose();
			});
		}
	};
};
