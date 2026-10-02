'use client';

import { MoreHorizontal, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmActionDialog } from '@/components/features/team/confirm-action-dialog';
import { EditMemberDialog } from '@/components/features/team/edit-member-dialog';
import { teamMessages } from '@/constants/team';
import type { TeamUser } from '@/types/team';
import { ApiError } from '@/utils/api-error';
import { clientApi } from '@/utils/client-api';
import { teamActionsFor } from '@/utils/team-rules';
import { displayName } from '@/utils/user-display';
import { Button } from '@workspace/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';

enum MemberDialog {
	EDIT = 'edit',
	SUSPEND = 'suspend',
	REACTIVATE = 'reactivate',
	REMOVE = 'remove'
}

interface MemberActionsProps {
	user: TeamUser;
	currentUserUuid: string;
}

/** The ⋯ menu on a Team row, and the dialogs its items open. */
export function MemberActions({ user, currentUserUuid }: MemberActionsProps) {
	const router = useRouter();
	const [dialog, setDialog] = useState<MemberDialog | null>(null);
	const actions = teamActionsFor(user, currentUserUuid);
	const name = displayName(user);

	const close = (open: boolean) => {
		if (!open) setDialog(null);
	};

	/** Runs a status change; on failure shows the API's reason and stays open. */
	const run = async (
		request: () => Promise<unknown>,
		successMessage: string
	) => {
		try {
			await request();
			toast.success(successMessage);
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
			throw error;
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label={teamMessages.actions.menuLabel(name)}
					>
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onSelect={() => setDialog(MemberDialog.EDIT)}
					>
						<Pencil />
						{teamMessages.actions.edit}
					</DropdownMenuItem>
					{actions.canSuspend ||
					actions.canReactivate ||
					actions.canRemove ? (
						<DropdownMenuSeparator />
					) : null}
					{actions.canSuspend ? (
						<DropdownMenuItem
							onSelect={() => setDialog(MemberDialog.SUSPEND)}
						>
							<UserX />
							{teamMessages.actions.suspend}
						</DropdownMenuItem>
					) : null}
					{actions.canReactivate ? (
						<DropdownMenuItem
							onSelect={() => setDialog(MemberDialog.REACTIVATE)}
						>
							<UserCheck />
							{teamMessages.actions.reactivate}
						</DropdownMenuItem>
					) : null}
					{actions.canRemove ? (
						<DropdownMenuItem
							variant="destructive"
							onSelect={() => setDialog(MemberDialog.REMOVE)}
						>
							<Trash2 />
							{teamMessages.actions.remove}
						</DropdownMenuItem>
					) : null}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Mounted only while open, so it always starts from saved values. */}
			{dialog === MemberDialog.EDIT ? (
				<EditMemberDialog
					user={user}
					actions={actions}
					open
					onOpenChange={close}
				/>
			) : null}
			<ConfirmActionDialog
				open={dialog === MemberDialog.SUSPEND}
				onOpenChange={close}
				title={teamMessages.confirm.suspendTitle(name)}
				description={teamMessages.confirm.suspendBody}
				confirmLabel={teamMessages.actions.suspend}
				destructive
				onConfirm={() =>
					run(
						() =>
							clientApi(`/users/${user.uuid}/suspend`, {
								method: 'POST'
							}),
						teamMessages.confirm.suspended(name)
					)
				}
			/>
			<ConfirmActionDialog
				open={dialog === MemberDialog.REACTIVATE}
				onOpenChange={close}
				title={teamMessages.confirm.reactivateTitle(name)}
				description={teamMessages.confirm.reactivateBody}
				confirmLabel={teamMessages.actions.reactivate}
				onConfirm={() =>
					run(
						() =>
							clientApi(`/users/${user.uuid}/reactivate`, {
								method: 'POST'
							}),
						teamMessages.confirm.reactivated(name)
					)
				}
			/>
			<ConfirmActionDialog
				open={dialog === MemberDialog.REMOVE}
				onOpenChange={close}
				title={teamMessages.confirm.removeTitle(name)}
				description={teamMessages.confirm.removeBody}
				confirmLabel={teamMessages.actions.remove}
				destructive
				onConfirm={() =>
					run(
						() =>
							clientApi(`/users/${user.uuid}`, {
								method: 'DELETE'
							}),
						teamMessages.confirm.removed(name)
					)
				}
			/>
		</>
	);
}
