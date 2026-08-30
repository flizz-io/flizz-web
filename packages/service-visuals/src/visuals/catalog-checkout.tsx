import * as THREE from 'three';

import { roundedRectOutline, centerGroup } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const COLUMNS = 3;
const ROWS = 2;
const CYCLE = 2.6;

/**
 * Online Store Development — a catalogue where one item leaves the grid and
 * arcs into the basket. Storefronts are judged on that arc, not on the grid.
 */
export const buildCatalogCheckout: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	scene.add(group);

	const tileGeometry = roundedRectOutline(0.42, 0.42, 0.07);
	const tiles = Array.from({ length: COLUMNS * ROWS }, (unused, index) => {
		const tile = new THREE.LineLoop(
			tileGeometry,
			new THREE.LineBasicMaterial({
				color: ink,
				transparent: true,
				opacity: 0.4
			})
		);

		tile.position.set(
			((index % COLUMNS) - (COLUMNS - 1) / 2) * 0.52 - 0.25,
			(Math.floor(index / COLUMNS) === 0 ? 1 : -1) * 0.3 + 0.35,
			0
		);
		tile.userData.home = tile.position.clone();
		group.add(tile);
		return tile;
	});

	const basket = new THREE.LineLoop(
		roundedRectOutline(0.62, 0.46, 0.1),
		new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0.6
		})
	);
	basket.position.set(0.95, -0.75, 0);
	group.add(basket);

	// The handle is what turns a rounded rectangle into a basket.
	const handle = new THREE.Line(
		new THREE.BufferGeometry().setFromPoints(
			Array.from({ length: 13 }, (unused, index) => {
				const angle = Math.PI * (index / 12);
				return new THREE.Vector3(
					0.95 + Math.cos(angle) * 0.2,
					-0.52 + Math.sin(angle) * 0.19,
					0
				);
			})
		),
		new THREE.LineBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0.55
		})
	);
	group.add(handle);

	centerGroup(group);

	return {
		update: (elapsed, focused) => {
			const cycle = focused ? CYCLE * 0.6 : CYCLE;
			const pass = Math.floor(elapsed / cycle);
			const t = (elapsed % cycle) / cycle;
			const chosen = pass % tiles.length;

			tiles.forEach((tile, index) => {
				const home = tile.userData.home as THREE.Vector3;
				const material = tile.material as THREE.LineBasicMaterial;

				if (index !== chosen || t > 0.75) {
					tile.position.copy(home);
					tile.scale.setScalar(1);
					material.color.copy(ink);
					material.opacity = 0.35;
					return;
				}

				// Arc out of the grid and into the basket.
				const travel = Math.min(1, t / 0.75);
				const eased = travel * travel * (3 - 2 * travel);

				tile.position.lerpVectors(home, basket.position, eased);
				tile.position.y += Math.sin(eased * Math.PI) * 0.45;
				tile.scale.setScalar(1 - eased * 0.45);
				material.color.copy(accent);
				material.opacity = 0.9 - eased * 0.3;
			});

			const landed = t > 0.72 && t < 0.9;
			(basket.material as THREE.LineBasicMaterial).opacity = landed
				? 1
				: 0.55;
			basket.scale.setScalar(landed ? 1.12 : 1);
		},
		dispose: () => {
			tileGeometry.dispose();
			tiles.forEach((t) => (t.material as THREE.Material).dispose());
			basket.geometry.dispose();
			(basket.material as THREE.Material).dispose();
			handle.geometry.dispose();
			(handle.material as THREE.Material).dispose();
		}
	};
};
