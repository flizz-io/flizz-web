/** Field limits for services — docs/requirements/services-crud.md#fields. */
export const serviceLimits = {
	title: 80,
	summary: 200,
	intro: 600,
	problem: 1500,
	listItem: 200,
	deliverablesMin: 1,
	deliverablesMax: 8,
	outcomesMin: 1,
	outcomesMax: 6,
	engagement: 120,
	faqQuestion: 200,
	faqAnswer: 1000,
	faqsMax: 10,
	seoTitle: 70,
	seoDescription: 200
} as const;

/**
 * The scenes in `@workspace/service-visuals` — a copy of its
 * `SERVICE_VISUAL_KINDS` (packages/service-visuals/src/types.ts). The API runs
 * compiled JavaScript and can't import that source-only React package, so
 * keep the two lists in step when a scene is added.
 */
export const serviceVisualKinds = [
	'layered-stack',
	'grid-lattice',
	'particle-swarm',
	'pulse-orb',
	'orbit-ring',
	'device-frame',
	'mvp-ascent',
	'tenant-column',
	'neural-layers',
	'dialogue-bubbles',
	'catalog-checkout',
	'dual-handset',
	'plugin-socket',
	'secure-rail'
] as const;
