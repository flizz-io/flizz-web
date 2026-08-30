import * as THREE from 'three';

import { centerGroup } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const LAYERS = [3, 4, 4, 2];
const SPAN = 2;

/**
 * AI Integration — a layered network with signal passing left to right through
 * it. Not a cloud of noise: a structure that takes an input and returns a
 * decision, which is the part worth embedding.
 */
export const buildNeuralLayers: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	scene.add(group);

	const nodes: { mesh: THREE.Mesh; depth: number }[] = [];
	const edges: { line: THREE.Line; depth: number }[] = [];
	const nodeGeometry = new THREE.SphereGeometry(0.075, 10, 10);

	const positions = LAYERS.map((count, layer) => {
		const x = (layer / (LAYERS.length - 1)) * SPAN - SPAN / 2;

		return Array.from({ length: count }, (unused, index) => {
			const y = (index - (count - 1) / 2) * 0.42;
			return new THREE.Vector3(x, y, 0);
		});
	});

	positions.forEach((layer, layerIndex) => {
		layer.forEach((point) => {
			const mesh = new THREE.Mesh(
				nodeGeometry,
				new THREE.MeshBasicMaterial({
					color: ink,
					transparent: true,
					opacity: 0.45
				})
			);

			mesh.position.copy(point);
			group.add(mesh);
			nodes.push({ mesh, depth: layerIndex });
		});

		const next = positions[layerIndex + 1];
		if (!next) return;

		layer.forEach((from) => {
			next.forEach((to) => {
				const line = new THREE.Line(
					new THREE.BufferGeometry().setFromPoints([from, to]),
					new THREE.LineBasicMaterial({
						color: accent,
						transparent: true,
						opacity: 0.12
					})
				);

				group.add(line);
				edges.push({ line, depth: layerIndex });
			});
		});
	});

	centerGroup(group);

	return {
		update: (elapsed, focused) => {
			// One wave sweeping the depth of the network, over and over.
			const head =
				(elapsed * (focused ? 1.9 : 0.9)) % (LAYERS.length + 1);

			nodes.forEach(({ mesh, depth }) => {
				const nearness = Math.max(0, 1 - Math.abs(head - depth));
				const material = mesh.material as THREE.MeshBasicMaterial;

				material.color.copy(nearness > 0.4 ? accent : ink);
				material.opacity = 0.35 + nearness * 0.65;
				mesh.scale.setScalar(1 + nearness * 0.5);
			});

			edges.forEach(({ line, depth }) => {
				const nearness = Math.max(0, 1 - Math.abs(head - depth - 0.5));
				(line.material as THREE.LineBasicMaterial).opacity =
					0.08 + nearness * 0.5;
			});

			group.rotation.y = Math.sin(elapsed * 0.3) * 0.22;
		},
		dispose: () => {
			nodeGeometry.dispose();
			nodes.forEach(({ mesh }) =>
				(mesh.material as THREE.Material).dispose()
			);
			edges.forEach(({ line }) => {
				line.geometry.dispose();
				(line.material as THREE.Material).dispose();
			});
		}
	};
};
