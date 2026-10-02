import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AddMemberDialog } from '@/components/features/team/add-member-dialog';
import { TeamTable } from '@/components/features/team/team-table';
import { homePath } from '@/constants/auth';
import { teamMessages } from '@/constants/team';
import type { TeamUser } from '@/types/team';
import { getCurrentUser } from '@/utils/get-current-user';
import { isAdminRole } from '@/utils/roles';
import { serverApi } from '@/utils/server-api';

export const metadata: Metadata = { title: teamMessages.title };

/**
 * Admins only — a Team Member who opens it goes back to Overview (the API
 * refuses them the list too).
 */
export default async function TeamPage() {
	const user = await getCurrentUser();
	if (!user || !isAdminRole(user.role)) redirect(homePath);

	const users = await serverApi<TeamUser[]>('/users');

	return (
		<>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						{teamMessages.title}
					</h1>
					<p className="max-w-prose text-muted-foreground">
						{teamMessages.lead}
					</p>
				</div>
				<AddMemberDialog />
			</div>
			<TeamTable
				users={users}
				currentUserUuid={user.uuid}
			/>
		</>
	);
}
