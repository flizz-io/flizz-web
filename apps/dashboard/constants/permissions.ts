import { Feature } from '@/enums/user';
import type { FeatureGrant } from '@/types/user';

/** Grid rows, in the order the drawer lists them. */
export const featureOrder: Feature[] = [
	Feature.PROJECTS,
	Feature.ARTICLES,
	Feature.SERVICES,
	Feature.TESTIMONIALS,
	Feature.CONTACT_MESSAGES
];

export const featureLabels: Record<Feature, string> = {
	[Feature.PROJECTS]: 'Projects',
	[Feature.ARTICLES]: 'Articles',
	[Feature.SERVICES]: 'Services',
	[Feature.TESTIMONIALS]: 'Testimonials',
	[Feature.CONTACT_MESSAGES]: 'Contact messages'
};

export type GrantAction = keyof FeatureGrant;

/** Grid columns, in order. */
export const grantActions: GrantAction[] = ['create', 'view', 'edit', 'delete'];

export const grantActionLabels: Record<GrantAction, string> = {
	create: 'Create',
	view: 'View',
	edit: 'Edit',
	delete: 'Delete'
};

export const permissionMessages = {
	menuItem: 'Permissions',
	title: (name: string) => `Permissions — ${name}`,
	lead: 'What this Team Member can do in each feature. Create, Edit and Delete include View; removing View removes the rest.',
	featureColumn: 'Feature',
	allColumn: 'All',
	allFor: (feature: string) => `All ${feature} permissions`,
	toggle: (action: string, feature: string) => `${action} ${feature}`,
	unsaved: 'Unsaved changes',
	save: 'Save permissions',
	cancel: 'Cancel',
	saved: (name: string) => `Permissions updated for ${name}.`
} as const;
