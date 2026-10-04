import {
	FolderKanban,
	Layers,
	LayoutDashboard,
	UserRound,
	Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { projectsPath } from '@/constants/projects';
import { servicesPath } from '@/constants/services';
import { Feature } from '@workspace/api-services';

export interface NavItem {
	title: string;
	href: string;
	icon: LucideIcon;
	/** Super Admin and Admins only. */
	adminOnly?: boolean;
	/** Shown only to users who may at least view this feature. */
	feature?: Feature;
}

/**
 * The sidebar. A feature gets its entry when its screens ship — never ahead
 * of them — gated by `feature` so only those who may view it see it.
 */
export const sidebarNavItems: NavItem[] = [
	{ title: 'Overview', href: '/', icon: LayoutDashboard },
	{
		title: 'Projects',
		href: projectsPath,
		icon: FolderKanban,
		feature: Feature.PROJECTS
	},
	{
		title: 'Services',
		href: servicesPath,
		icon: Layers,
		feature: Feature.SERVICES
	},
	{ title: 'Team', href: '/team', icon: Users, adminOnly: true }
];

/** Always available, below the main sections. */
export const sidebarAccountItems: NavItem[] = [
	{ title: 'My profile', href: '/profile', icon: UserRound }
];
