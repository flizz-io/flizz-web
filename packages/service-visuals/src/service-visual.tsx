'use client';

import { useRef } from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { serviceVisualRegistry } from './registry';
import type { ServiceVisualKind } from './types';
import { useServiceVisualScene } from './use-service-visual-scene';

interface ServiceVisualProps {
	kind: ServiceVisualKind;
	/** Brighter, faster, larger — each specimen defines its own focused read. */
	focused?: boolean;
	className?: string;
}

export function ServiceVisual({
	kind,
	focused = false,
	className
}: ServiceVisualProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useServiceVisualScene(
		containerRef,
		serviceVisualRegistry[kind].build,
		focused
	);

	return (
		<div
			ref={containerRef}
			aria-hidden
			className={cn('relative', className)}
		/>
	);
}
