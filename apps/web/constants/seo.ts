import { RoutePath } from '@/enums/routes';
import type { PageSeo } from '@/types/seo';

/**
 * The share-card size every network expects. Uploaded share images are cropped
 * to it (`shareImage` in `@workspace/media-library`), and the generated
 * `opengraph-image` routes render at it.
 */
export const shareImageSize = { width: 1200, height: 630 } as const;

/**
 * Search and share copy for the pages that have no database record. Titles are
 * keyword first and fit about 60 characters with the `— Flizz` suffix;
 * descriptions are 140–160 characters, the length Google shows in full.
 * See docs/guides/seo.md for the rules.
 */
export const staticPageSeo: Record<RoutePath, PageSeo> = {
	[RoutePath.HOME]: {
		label: 'Custom software & AI',
		title: 'Custom Software & AI Automation Studio — Flizz',
		description:
			'Flizz builds custom software, AI automation, e-commerce and mobile apps — maintainable systems you can scale, pivot or hand over without starting again.'
	},
	[RoutePath.SERVICES]: {
		label: 'Services',
		title: 'Software, AI & Mobile Development Services',
		description:
			'Custom software, AI and automation, e-commerce and mobile builds — what each costs in time, what you get, and when an off-the-shelf tool would do instead.'
	},
	[RoutePath.PORTFOLIO]: {
		label: 'Portfolio',
		title: 'Software Case Studies & Portfolio',
		description:
			'Builds across the sectors we work in and the change each one made — where it started, where it landed, and the ones that took longer than we said.'
	},
	[RoutePath.ABOUT]: {
		label: 'About',
		title: 'About Our Software Engineering Team',
		description:
			'Flizz started in 2024 building its own products before moving into services. Seven people, four of them founders, and every engagement priced up front.'
	},
	[RoutePath.ARTICLES]: {
		label: 'Articles',
		title: 'Articles on Building Software That Lasts',
		description:
			'Notes on building software that has to keep working — what we argue about, what we got wrong, and the engineering decisions that turned out to matter.'
	},
	[RoutePath.CONTACT]: {
		label: 'Contact',
		title: 'Contact Us for a Free Discovery Call',
		description:
			'Tell us what you are building, or what is breaking. An engineer replies within one business day, with a free discovery call and a fixed-price proposal.'
	}
};

/**
 * The generated share cards' palette. Hex rather than the theme variables,
 * because `next/og` renders outside the page and can't read CSS custom
 * properties. Always the dark theme — it reads best in a feed.
 */
export const shareCardColors = {
	background: '#08060d',
	foreground: '#f7f5fb',
	muted: '#9d94b8',
	accent: '#8b5cf6',
	highlight: '#b9a7ff',
	rule: '#4b4360'
} as const;

/** Eyebrow on the legal pages' share cards. */
export const legalShareCardLabel = 'Legal';
