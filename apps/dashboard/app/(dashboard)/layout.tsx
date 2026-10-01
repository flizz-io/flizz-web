import { redirect } from 'next/navigation';

import { AppSidebar } from '@/components/snippets/app-sidebar/app-sidebar';
import { DashboardHeader } from '@/components/snippets/dashboard-header/dashboard-header';
import { sessionExpiredPath } from '@/constants/auth';
import { getCurrentUser } from '@/utils/get-current-user';
import {
	SidebarInset,
	SidebarProvider
} from '@workspace/ui/components/sidebar';

/**
 * Every dashboard page sits behind this layout. The user is checked against
 * the API on each request — this, not `proxy.ts`, is the real gate.
 */
export default async function DashboardLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	const user = await getCurrentUser();
	if (!user) redirect(sessionExpiredPath);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<DashboardHeader user={user} />
				<div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
