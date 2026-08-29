'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useIsDarkTheme } from '@workspace/ui/hooks/use-is-dark-theme';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { readThemeColor } from '@workspace/ui/lib/css-color';

import type { ServiceVisualBuilder } from './types';

const MAX_PIXEL_RATIO = 2;
const FALLBACK_ACCENT = '#8b5cf6';
const FALLBACK_INK = '#e7e4f0';

/**
 * Lifecycle for one small specimen canvas. Sized to its own container rather
 * than the window — these mount inside cards that reflow independently of a
 * viewport resize — and gated by IntersectionObserver plus tab visibility so
 * a grid of these never burns GPU off screen. Each visual only supplies
 * `build`, which returns a per-frame `update` and its own `dispose`; this
 * hook owns the renderer, camera, and teardown shared by all of them.
 */
export function useServiceVisualScene(
	containerRef: React.RefObject<HTMLDivElement | null>,
	build: ServiceVisualBuilder,
	focused: boolean
) {
	const isDark = useIsDarkTheme();
	const prefersReducedMotion = usePrefersReducedMotion();
	const focusedRef = useRef(focused);

	useEffect(() => {
		focusedRef.current = focused;
	}, [focused]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true,
				powerPreference: 'low-power'
			});
		} catch {
			// No WebGL — the card still has its label; nothing more to do.
			return;
		}

		const accent = new THREE.Color(
			readThemeColor('--primary', FALLBACK_ACCENT)
		);
		const ink = new THREE.Color(
			readThemeColor('--foreground', FALLBACK_INK)
		);

		const scene = new THREE.Scene();
		// Framed tight: at z=6 every specimen floated in the middle of its
		// canvas with dead space all round, which is what made them read as
		// thumbnails rather than objects.
		const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
		camera.position.set(0, 0, 4.6);

		const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
		renderer.setPixelRatio(pixelRatio);
		renderer.setClearColor(0x000000, 0);
		container.append(renderer.domElement);
		renderer.domElement.style.width = '100%';
		renderer.domElement.style.height = '100%';

		const handle = build(scene, { accent, ink }, isDark);

		const resize = () => {
			const { clientWidth, clientHeight } = container;
			if (!clientWidth || !clientHeight) return;

			camera.aspect = clientWidth / clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(clientWidth, clientHeight, false);
		};

		let animationFrame = 0;
		const startTime = performance.now();

		const render = () => {
			handle.update(
				(performance.now() - startTime) / 1000,
				focusedRef.current
			);
			renderer.render(scene, camera);
			animationFrame = requestAnimationFrame(render);
		};

		const start = () => {
			if (animationFrame || prefersReducedMotion) return;
			animationFrame = requestAnimationFrame(render);
		};

		const stop = () => {
			if (!animationFrame) return;
			cancelAnimationFrame(animationFrame);
			animationFrame = 0;
		};

		resize();
		handle.update(0, focusedRef.current);
		renderer.render(scene, camera);

		const observer = new IntersectionObserver(([entry]) =>
			entry?.isIntersecting ? start() : stop()
		);
		observer.observe(container);

		const onVisibilityChange = () => (document.hidden ? stop() : start());

		window.addEventListener('resize', resize);
		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			stop();
			observer.disconnect();
			window.removeEventListener('resize', resize);
			document.removeEventListener(
				'visibilitychange',
				onVisibilityChange
			);

			handle.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		};
		// `focused` is read through `focusedRef` inside the render loop, not
		// referenced here, so the scene isn't torn down and rebuilt on hover.
	}, [containerRef, build, isDark, prefersReducedMotion]);
}
