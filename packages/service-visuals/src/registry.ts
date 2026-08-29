import { buildDeviceFrame } from './visuals/device-frame';
import { buildGridLattice } from './visuals/grid-lattice';
import { buildLayeredStack } from './visuals/layered-stack';
import { buildOrbitRing } from './visuals/orbit-ring';
import { buildParticleSwarm } from './visuals/particle-swarm';
import { buildPulseOrb } from './visuals/pulse-orb';
import type { ServiceVisualDefinition, ServiceVisualKind } from './types';

/**
 * Every specimen, keyed by its stable id. A service record only ever stores
 * this key — today from `constants/home.ts`, later from the admin CRUD's
 * visual picker — so the palette can grow without touching call sites.
 */
export const serviceVisualRegistry: Record<
	ServiceVisualKind,
	ServiceVisualDefinition
> = {
	'layered-stack': {
		id: 'layered-stack',
		label: 'Layered Stack',
		build: buildLayeredStack
	},
	'grid-lattice': {
		id: 'grid-lattice',
		label: 'Grid Lattice',
		build: buildGridLattice
	},
	'particle-swarm': {
		id: 'particle-swarm',
		label: 'Particle Swarm',
		build: buildParticleSwarm
	},
	'pulse-orb': {
		id: 'pulse-orb',
		label: 'Pulse Orb',
		build: buildPulseOrb
	},
	'orbit-ring': {
		id: 'orbit-ring',
		label: 'Orbit Ring',
		build: buildOrbitRing
	},
	'device-frame': {
		id: 'device-frame',
		label: 'Device Frame',
		build: buildDeviceFrame
	}
};

/** Stable-order list — what a picker UI (e.g. the future admin CRUD) iterates. */
export const serviceVisualList: ServiceVisualDefinition[] = Object.values(
	serviceVisualRegistry
);
