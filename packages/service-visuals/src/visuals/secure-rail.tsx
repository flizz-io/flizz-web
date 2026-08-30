import * as THREE from 'three';

import {
	circleOutline,
	roundedRectOutline,
	signalDot,
	centerGroup
} from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const CYCLE = 2.8;

/**
 * Payment Integration — value leaving a card, crossing a rail, and arriving
 * inside a closed ring. The whole service is that the transit is uneventful.
 */
export const buildSecureRail: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	scene.add(group);

	const card = new THREE.LineLoop(
		roundedRectOutline(0.86, 0.56, 0.09),
		new THREE.LineBasicMaterial({
			color: ink,
			transparent: true,
			opacity: 0.6
		})
	);
	card.position.set(-0.85, 0.12, 0);
	group.add(card);

	// The magnetic stripe, so the card reads as a card at this size.
	const stripe = new THREE.Line(
		new THREE.BufferGeometry().setFromPoints([
			new THREE.Vector3(-1.24, 0.24, 0),
			new THREE.Vector3(-0.46, 0.24, 0)
		]),
		new THREE.LineBasicMaterial({
			color: ink,
			transparent: true,
			opacity: 0.35
		})
	);
	group.add(stripe);

	const vault = new THREE.LineLoop(
		circleOutline(0.42, 40),
		new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0.55
		})
	);
	vault.position.set(0.92, -0.1, 0);
	group.add(vault);

	const rail = new THREE.Line(
		new THREE.BufferGeometry().setFromPoints([
			new THREE.Vector3(-0.85, -0.24, 0),
			new THREE.Vector3(0.92, -0.24, 0)
		]),
		new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0.22
		})
	);
	group.add(rail);

	const token = signalDot(accent, 0.07, 0.95);
	group.add(token);

	centerGroup(group);

	return {
		update: (elapsed, focused) => {
			const cycle = focused ? CYCLE * 0.6 : CYCLE;
			const t = (elapsed % cycle) / cycle;
			const travel = Math.min(1, t / 0.7);

			token.position.set(-0.85 + travel * 1.77, -0.24, 0);
			(token.material as THREE.MeshBasicMaterial).opacity =
				Math.sin(Math.min(1, t / 0.75) * Math.PI) * 0.95;

			const arrived = t > 0.7;
			(vault.material as THREE.LineBasicMaterial).opacity = arrived
				? 1
				: 0.5;
			vault.scale.setScalar(arrived ? 1.1 : 1);
			(card.material as THREE.LineBasicMaterial).opacity =
				t < 0.15 ? 0.95 : 0.55;
			(rail.material as THREE.LineBasicMaterial).opacity =
				0.18 + (1 - Math.abs(travel - 0.5) * 2) * 0.3;

			group.rotation.y = Math.sin(elapsed * 0.26) * 0.14;
		},
		dispose: () => {
			[card, stripe, vault, rail].forEach((part) => {
				part.geometry.dispose();
				(part.material as THREE.Material).dispose();
			});
			token.geometry.dispose();
			(token.material as THREE.Material).dispose();
		}
	};
};
