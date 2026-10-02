'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/snippets/logo/logo';
import { sidebarAccountItems, sidebarNavItems } from '@/configs/navigation';
import type { NavItem } from '@/configs/navigation';
import { isAdminRole } from '@/utils/roles';
import type { AuthUser } from '@workspace/api-services';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail
} from '@workspace/ui/components/sidebar';

type SidebarUser = Pick<AuthUser, 'role' | 'permissions'>;

/** True for the item's own page and anything under it (not for `/` alone). */
function isActive(pathname: string, href: string) {
	return href === '/'
		? pathname === '/'
		: pathname === href || pathname.startsWith(`${href}/`);
}

/** Whether this user may use a section — the API checks again on every call. */
function canSee(item: NavItem, user: SidebarUser) {
	if (item.adminOnly && !isAdminRole(user.role)) return false;
	if (item.feature && !user.permissions[item.feature].view) return false;

	return true;
}

function NavMenu({ items, pathname }: { items: NavItem[]; pathname: string }) {
	return (
		<SidebarMenu>
			{items.map((item) => (
				<SidebarMenuItem key={item.href}>
					<SidebarMenuButton
						asChild
						isActive={isActive(pathname, item.href)}
						tooltip={item.title}
					>
						<Link href={item.href}>
							<item.icon />
							<span>{item.title}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}

interface AppSidebarProps {
	user: SidebarUser;
}

/** Shows only the sections this user may use; their account sits at the foot. */
export function AppSidebar({ user }: AppSidebarProps) {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="px-3 py-4">
				<Link
					href="/"
					className="flex items-center"
				>
					<Logo />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<NavMenu
							items={sidebarNavItems.filter((item) =>
								canSee(item, user)
							)}
							pathname={pathname}
						/>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavMenu
					items={sidebarAccountItems}
					pathname={pathname}
				/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
