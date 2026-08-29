import * as THREE from 'three';

import { roundedRectOutline, signalDot, centerGroup } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

/**
 * Native Mobile App Development — two handsets, one build. A pulse crosses
 * between them to say both platforms are first-class rather than one being a
 * port of the other.
 */
export const buildDualHandset: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	scene.add(group);

	const shellGeometry = roundedRectOutline(0.68, 1.32, 0.14);
	const handsets = [-1, 1].map((side) => {
		const handset = new THREE.LineLoop(
			shellGeometry,
			new THREE.LineBasicMaterial({
				color: side < 0 ? accent : ink,
				transparent: true,
				opacity: 0.65
			})
		);

		handset.position.set(side * 0.52, 0, 0);
		handset.rotation.y = side * -0.35;
		group.add(handset);
		return handset;
	});

	const bridge = new THREE.Line(
		new THREE.BufferGeometry().setFromPoints([
			new THREE.Vector3(-0.52, 0, 0),
			new THREE.Vector3(0, 0.34, 0),
			new THREE.Vector3(0.52, 0, 0)
		]),
		new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0.25
		})
	);
	group.add(bridge);

	const pulse = signalDot(accent, 0.06, 0.9);
	group.add(pulse);

	const path = new THREE.QuadraticBezierCurve3(
		new THREE.Vector3(-0.52, 0, 0),
		new THREE.Vector3(0, 0.5, 0),
		new THREE.Vector3(0.52, 0, 0)
	);

	centerGroup(group);

	return {
		update: (elapsed, focused) => {
			const cycle = focused ? 1.6 : 2.8;
			const raw = (elapsed % cycle) / cycle;
			// Ping-pong, so the pulse belongs to both handsets equally.
			const t = raw < 0.5 ? raw * 2 : (1 - raw) * 2;

			pulse.position.copy(path.getPoint(t));

			handsets.forEach((handset, index) => {
				const near = index === 0 ? 1 - t : t;
				const material = handset.material as THREE.LineBasicMaterial;

				material.opacity = 0.5 + near * 0.5;
				handset.scale.setScalar(1 + near * 0.05);
			});

			group.rotation.y = Math.sin(elapsed * 0.24) * 0.2;
		},
		dispose: () => {
			shellGeometry.dispose();
			handsets.forEach((h) => (h.material as THREE.Material).dispose());
			bridge.geometry.dispose();
			(bridge.material as THREE.Material).dispose();
			pulse.geometry.dispose();
			(pulse.material as THREE.Material).dispose();
		}
	};
};
