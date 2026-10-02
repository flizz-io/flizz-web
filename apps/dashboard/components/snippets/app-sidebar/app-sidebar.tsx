'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/snippets/logo/logo';
import { sidebarNavItems } from '@/configs/navigation';
import type { UserRole } from '@/enums/user';
import { isAdminRole } from '@/utils/roles';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail
} from '@workspace/ui/components/sidebar';

/** True for the item's own page and anything under it (not for `/` alone). */
function isActive(pathname: string, href: string) {
	return href === '/'
		? pathname === '/'
		: pathname === href || pathname.startsWith(`${href}/`);
}

interface AppSidebarProps {
	role: UserRole;
}

/** Shows only the sections this user may use. */
export function AppSidebar({ role }: AppSidebarProps) {
	const pathname = usePathname();
	const items = sidebarNavItems.filter(
		(item) => !item.adminOnly || isAdminRole(role)
	);

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
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
