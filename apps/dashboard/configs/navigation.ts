import { LayoutDashboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
	title: string;
	href: string;
	icon: LucideIcon;
}

/**
 * The sidebar. A feature gets its entry when its screens ship — never ahead
 * of them (Projects lands with task D2).
 */
export const sidebarNavItems: NavItem[] = [
	{ title: 'Overview', href: '/', icon: LayoutDashboard }
];
