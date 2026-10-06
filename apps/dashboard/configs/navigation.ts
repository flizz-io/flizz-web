import {
	FolderKanban,
	Inbox,
	Layers,
	LayoutDashboard,
	Newspaper,
	Quote,
	UserRound,
	Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

import { UnreadMessagesBadge } from '@/components/features/messages/unread-messages-badge';
import { articlesPath } from '@/constants/articles';
import { messagesPath } from '@/constants/contact-messages';
import { projectsPath } from '@/constants/projects';
import { servicesPath } from '@/constants/services';
import { testimonialsPath } from '@/constants/testimonials';
import { Feature } from '@workspace/api-services';

export interface NavItem {
	title: string;
	href: string;
	icon: LucideIcon;
	/** Super Admin and Admins only. */
	adminOnly?: boolean;
	/** Shown only to users who may at least view this feature. */
	feature?: Feature;
	/** A count beside the title — rendered only for those who see the item. */
	badge?: ComponentType;
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
	{
		title: 'Articles',
		href: articlesPath,
		icon: Newspaper,
		feature: Feature.ARTICLES
	},
	{
		title: 'Testimonials',
		href: testimonialsPath,
		icon: Quote,
		feature: Feature.TESTIMONIALS
	},
	{
		title: 'Messages',
		href: messagesPath,
		icon: Inbox,
		feature: Feature.CONTACT_MESSAGES,
		badge: UnreadMessagesBadge
	},
	{ title: 'Team', href: '/team', icon: Users, adminOnly: true }
];

/** Always available, below the main sections. */
export const sidebarAccountItems: NavItem[] = [
	{ title: 'My profile', href: '/profile', icon: UserRound }
];
