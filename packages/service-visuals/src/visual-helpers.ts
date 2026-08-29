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
