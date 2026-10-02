import { LayoutDashboard, UserRound, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { Feature } from '@/enums/user';

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
 * of them (Projects lands with task D2, gated by `feature`).
 */
export const sidebarNavItems: NavItem[] = [
	{ title: 'Overview', href: '/', icon: LayoutDashboard },
	{ title: 'Team', href: '/team', icon: Users, adminOnly: true }
];

/** Always available, below the main sections. */
export const sidebarAccountItems: NavItem[] = [
	{ title: 'My profile', href: '/profile', icon: UserRound }
];
