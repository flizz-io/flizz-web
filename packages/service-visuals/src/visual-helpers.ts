import * as THREE from 'three';

/**
 * Builds a wireframe from a solid geometry's edges and disposes the source
 * geometry immediately — only the derived `EdgesGeometry` is ever added to
 * the scene, so the source has no further use.
 */
export function wireframeFromGeometry(
	geometry: THREE.BufferGeometry,
	color: THREE.Color,
	opacity: number
): THREE.LineSegments {
	const edges = new THREE.EdgesGeometry(geometry);
	geometry.dispose();

	const material = new THREE.LineBasicMaterial({
		color,
		transparent: true,
		opacity
	});

	return new THREE.LineSegments(edges, material);
}

/** A flat, camera-facing circle outline — used for radar-style pulse rings. */
export function circleOutline(
	radius: number,
	segments = 48
): THREE.BufferGeometry {
	const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2);
	return new THREE.BufferGeometry().setFromPoints(curve.getPoints(segments));
}

/**
 * The outline of a rounded rectangle — screens, cards, speech bubbles. Returns
 * points only, so it draws as a `LineLoop` rather than a filled shape.
 */
export function roundedRectOutline(
	width: number,
	height: number,
	radius: number,
	segments = 6
): THREE.BufferGeometry {
	const halfWidth = width / 2;
	const halfHeight = height / 2;
	const corner = Math.min(radius, halfWidth, halfHeight);
	const shape = new THREE.Shape();

	shape.moveTo(-halfWidth + corner, -halfHeight);
	shape.lineTo(halfWidth - corner, -halfHeight);
	shape.absarc(
		halfWidth - corner,
		-halfHeight + corner,
		corner,
		-Math.PI / 2,
		0,
		false
	);
	shape.lineTo(halfWidth, halfHeight - corner);
	shape.absarc(
		halfWidth - corner,
		halfHeight - corner,
		corner,
		0,
		Math.PI / 2,
		false
	);
	shape.lineTo(-halfWidth + corner, halfHeight);
	shape.absarc(
		-halfWidth + corner,
		halfHeight - corner,
		corner,
		Math.PI / 2,
		Math.PI,
		false
	);
	shape.lineTo(-halfWidth, -halfHeight + corner);
	shape.absarc(
		-halfWidth + corner,
		-halfHeight + corner,
		corner,
		Math.PI,
		Math.PI * 1.5,
		false
	);

	return new THREE.BufferGeometry().setFromPoints(shape.getPoints(segments));
}

/** A small filled dot used as a travelling signal in several visuals. */
export function signalDot(
	color: THREE.Color,
	radius = 0.06,
	opacity = 0.9
): THREE.Mesh {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, 10, 10),
		new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
	);
}

/**
 * Centres a group's contents in the frame.
 *
 * Geometry gets laid out at whatever coordinates read clearly while writing a
 * visual, which rarely leaves the result centred — and a specimen sitting off
 * to one side of its canvas looks like a bug rather than a composition. Call
 * once after building, at the rest pose.
 */
export function centerGroup(group: THREE.Object3D) {
	const center = new THREE.Vector3();
	new THREE.Box3().setFromObject(group).getCenter(center);
	group.position.sub(center);
}
