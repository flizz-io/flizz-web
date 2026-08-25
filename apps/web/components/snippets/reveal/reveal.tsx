'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@workspace/ui/lib/utils';

interface RevealProps {
	children: React.ReactNode;
	delay?: number;
	trigger?: 'view' | 'mount';
	className?: string;
}

export function Reveal({
	children,
	delay = 0,
	trigger = 'view',
	className
}: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		setIsVisible(false);

		if (trigger === 'mount') {
			const raf = requestAnimationFrame(() =>
				requestAnimationFrame(() => setIsVisible(true))
			);
			return () => cancelAnimationFrame(raf);
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(node);
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
		);
		observer.observe(node);

		return () => observer.disconnect();
	}, [trigger]);

	return (
		<div
			ref={ref}
			data-revealed={isVisible}
			style={delay ? { transitionDelay: `${delay}ms` } : undefined}
			className={cn(
				'group/reveal motion-safe:transition-[opacity,transform,filter] motion-safe:duration-500 motion-safe:ease-power-on',
				isVisible
					? 'translate-y-0 opacity-100 blur-none'
					: 'translate-y-3 opacity-0 blur-[6px]',
				className
			)}
		>
			{children}
		</div>
	);
}
