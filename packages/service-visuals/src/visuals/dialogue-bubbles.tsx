import * as THREE from 'three';

import { roundedRectOutline, signalDot, centerGroup } from '../visual-helpers';
import type { ServiceVisualBuilder } from '../types';

const CYCLE = 3.2;

/**
 * Chatbots & Conversational AI — two bubbles taking turns. The reply composes
 * (three dots filling) before it lands, because the point is a conversation
 * that resolves, not a canned answer.
 */
export const buildDialogueBubbles: ServiceVisualBuilder = (
	scene,
	{ accent, ink }
) => {
	const group = new THREE.Group();
	scene.add(group);

	const shape = roundedRectOutline(1.35, 0.72, 0.18);
	const make = (x: number, y: number, color: THREE.Color) => {
		const bubble = new THREE.LineLoop(
			shape,
			new THREE.LineBasicMaterial({
				color,
				transparent: true,
				opacity: 0.5
			})
		);

		bubble.position.set(x, y, 0);
		group.add(bubble);
		return bubble;
	};

	const asked = make(-0.42, 0.52, ink);
	const answered = make(0.42, -0.52, accent);

	// Tails, pointing at each other. Without them these are just rectangles.
	const tail = (x: number, y: number, dir: number, color: THREE.Color) => {
		const line = new THREE.Line(
			new THREE.BufferGeometry().setFromPoints([
				new THREE.Vector3(x + dir * 0.18, y, 0),
				new THREE.Vector3(x + dir * 0.42, y - 0.26, 0),
				new THREE.Vector3(x + dir * 0.44, y + 0.02, 0)
			]),
			new THREE.LineBasicMaterial({
				color,
				transparent: true,
				opacity: 0.5
			})
		);

		group.add(line);
		return line;
	};

	const tails = [tail(-0.42, 0.18, 1, ink), tail(0.42, -0.86, -1, accent)];

	// The reply composing itself, one dot at a time.
	const dotGeometry = new THREE.SphereGeometry(0.052, 10, 10);
	const dots = [-0.2, 0, 0.2].map((offset) => {
		const dot = new THREE.Mesh(
			dotGeometry,
			new THREE.MeshBasicMaterial({
				color: accent,
				transparent: true,
				opacity: 0
			})
		);

		dot.position.set(0.42 + offset, -0.52, 0);
		group.add(dot);
		return dot;
	});

	const carrier = signalDot(accent, 0.055, 0);
	group.add(carrier);

	centerGroup(group);

	return {
		update: (elapsed, focused) => {
			const cycle = focused ? CYCLE * 0.6 : CYCLE;
			const t = (elapsed % cycle) / cycle;

			// 0.00–0.35 the question travels, 0.35–0.75 the reply composes,
			// 0.75–1.00 the reply lands.
			const travelling = Math.min(1, Math.max(0, t / 0.35));
			carrier.position.set(
				-0.42 + travelling * 0.84,
				0.52 - travelling * 1.04,
				0
			);
			(carrier.material as THREE.MeshBasicMaterial).opacity =
				t < 0.35 ? Math.sin(travelling * Math.PI) * 0.9 : 0;

			dots.forEach((dot, index) => {
				const at = 0.4 + index * 0.1;
				const on = t > at && t < 0.78;
				(dot.material as THREE.MeshBasicMaterial).opacity = on
					? 0.85
					: 0;
			});

			const landed = t > 0.78;
			(answered.material as THREE.LineBasicMaterial).opacity = landed
				? 0.95
				: 0.4;
			answered.scale.setScalar(landed ? 1.05 : 1);
			(asked.material as THREE.LineBasicMaterial).opacity =
				t < 0.35 ? 0.9 : 0.4;
		},
		dispose: () => {
			shape.dispose();
			dotGeometry.dispose();
			[asked, answered].forEach((b) =>
				(b.material as THREE.Material).dispose()
			);
			tails.forEach((t) => {
				t.geometry.dispose();
				(t.material as THREE.Material).dispose();
			});
			dots.forEach((d) => (d.material as THREE.Material).dispose());
			carrier.geometry.dispose();
			(carrier.material as THREE.Material).dispose();
		}
	};
};
