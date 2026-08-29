import * as THREE from 'three';

import {
	roundedRectOutline,
	wireframeFromGeometry,
	centerGroup
} from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const TENANTS = 5;
const RADIUS = 1.05;

/**
 * SaaS Application Development — one shared core with tenants arranged around
 * it, each provisioned in turn. Multi-tenancy is the shape of the thing.
 */
export const buildTenantColumn: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	group.rotation.x = -0.2;
	scene.add(group);

	const core = wireframeFromGeometry(
		new THREE.CylinderGeometry(0.2, 0.2, 1.5, 6),
		accent,
		0.85
	);
	group.add(core);

	const plateGeometry = roundedRectOutline(0.5, 0.34, 0.06);
	const tenants = Array.from({ length: TENANTS }, (unused, index) => {
		const angle = (index / TENANTS) * Math.PI * 2;
		const holder = new THREE.Group();

		const plate = new THREE.LineLoop(
			plateGeometry,
			new THREE.LineBasicMaterial({
				color: ink,
				transparent: true,
				opacity: 0.4
			})
		);

		holder.position.set(
			Math.cos(angle) * RADIUS,
			0,
			Math.sin(angle) * RADIUS
		);
		holder.rotation.y = -angle + Math.PI / 2;
		holder.add(plate);
		group.add(holder);

		// The spoke back to the shared core.
		const spoke = new THREE.Line(
			new THREE.BufferGeometry().setFromPoints([
				new THREE.Vector3(0, 0, 0),
				holder.position.clone()
			]),
			new THREE.LineBasicMaterial({
				color: accent,
				transparent: true,
				opacity: 0.18
			})
		);
		group.add(spoke);

		return { plate, spoke };
	});

	centerGroup(group);

	return {
		update: (elapsed, focused) => {
			const rate = focused ? 1.6 : 0.8;
			const head = (elapsed * rate) % TENANTS;

			tenants.forEach(({ plate, spoke }, index) => {
				const nearness = Math.max(0, 1 - Math.abs(head - index));
				const plateMaterial = plate.material as THREE.LineBasicMaterial;
				const spokeMaterial = spoke.material as THREE.LineBasicMaterial;

				plateMaterial.color.copy(nearness > 0.5 ? accent : ink);
				plateMaterial.opacity = 0.3 + nearness * 0.6;
				spokeMaterial.opacity = 0.12 + nearness * 0.5;
			});

			group.rotation.y = elapsed * (focused ? 0.45 : 0.2);
		},
		dispose: () => {
			core.geometry.dispose();
			(core.material as THREE.Material).dispose();
			plateGeometry.dispose();
			tenants.forEach(({ plate, spoke }) => {
				(plate.material as THREE.Material).dispose();
				spoke.geometry.dispose();
				(spoke.material as THREE.Material).dispose();
			});
		}
	};
};
