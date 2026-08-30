import * as THREE from 'three';

import type { ServiceVisualBuilder } from '../types';

const POINT_COUNT = 160;

/** AI Integration — noise condensing into a coherent shape, and back. */
export const buildParticleSwarm: ServiceVisualBuilder = (scene, { accent }) => {
	const scatter = new Float32Array(POINT_COUNT * 3);
	const sphere = new Float32Array(POINT_COUNT * 3);
	const positions = new Float32Array(POINT_COUNT * 3);

	for (let index = 0; index < POINT_COUNT; index += 1) {
		scatter[index * 3] = (Math.random() - 0.5) * 2.6;
		scatter[index * 3 + 1] = (Math.random() - 0.5) * 2.6;
		scatter[index * 3 + 2] = (Math.random() - 0.5) * 2.6;

		// A Fibonacci sphere gives an even shell instead of clumped points.
		const t = index / POINT_COUNT;
		const inclination = Math.acos(1 - 2 * t);
		const azimuth = Math.PI * 2 * 0.618034 * index;
		const radius = 0.85;

		sphere[index * 3] = radius * Math.sin(inclination) * Math.cos(azimuth);
		sphere[index * 3 + 1] =
			radius * Math.sin(inclination) * Math.sin(azimuth);
		sphere[index * 3 + 2] = radius * Math.cos(inclination);
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

	const material = new THREE.PointsMaterial({
		color: accent,
		size: 0.045,
		transparent: true,
		opacity: 0.85,
		sizeAttenuation: true
	});

	const points = new THREE.Points(geometry, material);
	scene.add(points);

	return {
		update: (elapsed, focused) => {
			const rate = focused ? 1.4 : 0.55;
			const wave = 0.5 + 0.5 * Math.sin(elapsed * rate);
			const bias = focused ? Math.min(1, wave + 0.3) : wave;
			const attribute = geometry.attributes
				.position as THREE.BufferAttribute;

			for (let index = 0; index < POINT_COUNT; index += 1) {
				const from = scatter[index * 3] ?? 0;
				const to = sphere[index * 3] ?? 0;
				positions[index * 3] = from + (to - from) * bias;

				const fromY = scatter[index * 3 + 1] ?? 0;
				const toY = sphere[index * 3 + 1] ?? 0;
				positions[index * 3 + 1] = fromY + (toY - fromY) * bias;

				const fromZ = scatter[index * 3 + 2] ?? 0;
				const toZ = sphere[index * 3 + 2] ?? 0;
				positions[index * 3 + 2] = fromZ + (toZ - fromZ) * bias;
			}

			attribute.needsUpdate = true;
			points.rotation.y = elapsed * 0.15;
		},
		dispose: () => {
			geometry.dispose();
			material.dispose();
		}
	};
};
