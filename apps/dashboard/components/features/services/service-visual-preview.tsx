'use client';

import dynamic from 'next/dynamic';

import type { ServiceVisualKind } from '@workspace/service-visuals';

// Three.js only loads once the form is open — and only one scene mounts.
const ServiceVisual = dynamic(
	() =>
		import('@workspace/service-visuals').then(
			(visuals) => visuals.ServiceVisual
		),
	{ ssr: false }
);

/** The chosen scene, live — one WebGL context however often it changes. */
export function ServiceVisualPreview({ kind }: { kind: ServiceVisualKind }) {
	return (
		<div className="aspect-4/3 w-full overflow-hidden rounded-lg border bg-muted/40">
			<ServiceVisual
				key={kind}
				kind={kind}
				focused
				className="size-full"
			/>
		</div>
	);
}
