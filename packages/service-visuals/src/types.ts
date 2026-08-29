import type * as THREE from 'three';

export const SERVICE_VISUAL_KINDS = [
	'layered-stack',
	'grid-lattice',
	'particle-swarm',
	'pulse-orb',
	'orbit-ring',
	'device-frame',
	// Purpose-built per service; the six above stay available to the picker.
	'mvp-ascent',
	'tenant-column',
	'neural-layers',
	'dialogue-bubbles',
	'catalog-checkout',
	'dual-handset',
	'plugin-socket',
	'secure-rail'
] as const;

export type ServiceVisualKind = (typeof SERVICE_VISUAL_KINDS)[number];

export interface ServiceVisualColors {
	accent: THREE.Color;
	ink: THREE.Color;
}

export interface ServiceVisualHandle {
	/** Called once per frame with seconds elapsed and whether this instance is focused. */
	update: (elapsed: number, focused: boolean) => void;
	dispose: () => void;
}

export type ServiceVisualBuilder = (
	scene: THREE.Scene,
	colors: ServiceVisualColors,
	isDark: boolean
) => ServiceVisualHandle;

export interface ServiceVisualDefinition {
	id: ServiceVisualKind;
	/** Shown as the option label in the future admin picker. */
	label: string;
	build: ServiceVisualBuilder;
}
