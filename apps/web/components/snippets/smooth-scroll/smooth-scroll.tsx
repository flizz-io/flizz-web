'use client';

import { ReactLenis } from 'lenis/react';

interface SmoothScrollProps {
	children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
	return (
		<ReactLenis
			root
			options={{ lerp: 0.1, duration: 1.1 }}
		>
			{children}
		</ReactLenis>
	);
}
