import { buildCatalogCheckout } from './visuals/catalog-checkout';
import { buildDeviceFrame } from './visuals/device-frame';
import { buildDialogueBubbles } from './visuals/dialogue-bubbles';
import { buildDualHandset } from './visuals/dual-handset';
import { buildGridLattice } from './visuals/grid-lattice';
import { buildLayeredStack } from './visuals/layered-stack';
import { buildMvpAscent } from './visuals/mvp-ascent';
import { buildNeuralLayers } from './visuals/neural-layers';
import { buildOrbitRing } from './visuals/orbit-ring';
import { buildParticleSwarm } from './visuals/particle-swarm';
import { buildPluginSocket } from './visuals/plugin-socket';
import { buildPulseOrb } from './visuals/pulse-orb';
import { buildSecureRail } from './visuals/secure-rail';
import { buildTenantColumn } from './visuals/tenant-column';
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
	},
	'mvp-ascent': {
		id: 'mvp-ascent',
		label: 'MVP Ascent',
		build: buildMvpAscent
	},
	'tenant-column': {
		id: 'tenant-column',
		label: 'Tenant Column',
		build: buildTenantColumn
	},
	'neural-layers': {
		id: 'neural-layers',
		label: 'Neural Layers',
		build: buildNeuralLayers
	},
	'dialogue-bubbles': {
		id: 'dialogue-bubbles',
		label: 'Dialogue Bubbles',
		build: buildDialogueBubbles
	},
	'catalog-checkout': {
		id: 'catalog-checkout',
		label: 'Catalogue to Basket',
		build: buildCatalogCheckout
	},
	'dual-handset': {
		id: 'dual-handset',
		label: 'Dual Handset',
		build: buildDualHandset
	},
	'plugin-socket': {
		id: 'plugin-socket',
		label: 'Plugin Socket',
		build: buildPluginSocket
	},
	'secure-rail': {
		id: 'secure-rail',
		label: 'Secure Rail',
		build: buildSecureRail
	}
};

/** Stable-order list — what a picker UI (e.g. the future admin CRUD) iterates. */
export const serviceVisualList: ServiceVisualDefinition[] = Object.values(
	serviceVisualRegistry
);
