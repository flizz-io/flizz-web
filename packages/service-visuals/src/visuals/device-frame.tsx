import * as THREE from 'three';

import { wireframeFromGeometry } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const FRAME_HEIGHT = 1.9;
const FRAME_WIDTH = 1;

/** Native Mobile App Development — a device outline with a live scanline. */
export const buildDeviceFrame: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	group.rotation.y = 0.5;
	group.rotation.x = -0.12;
	scene.add(group);

	const frame = wireframeFromGeometry(
		new THREE.BoxGeometry(FRAME_WIDTH, FRAME_HEIGHT, 0.06),
		ink,
		0.65
	);
	group.add(frame);

	const scanlineGeometry = new THREE.PlaneGeometry(FRAME_WIDTH * 0.86, 0.05);
	const scanlineMaterial = new THREE.MeshBasicMaterial({
		color: accent,
		transparent: true,
		opacity: 0.7,
		side: THREE.DoubleSide
	});
	const scanline = new THREE.Mesh(scanlineGeometry, scanlineMaterial);
	scanline.position.z = 0.035;
	group.add(scanline);

	return {
		update: (elapsed, focused) => {
			const speed = focused ? 0.9 : 0.45;
			const t = (elapsed * speed) % 1;

			scanline.position.y = FRAME_HEIGHT / 2 - t * FRAME_HEIGHT;
			scanlineMaterial.opacity = focused ? 0.85 : 0.55;
			group.rotation.y = 0.5 + Math.sin(elapsed * 0.2) * 0.12;
		},
		dispose: () => {
			frame.geometry.dispose();
			(frame.material as THREE.Material).dispose();
			scanlineGeometry.dispose();
			scanlineMaterial.dispose();
		}
	};
};
