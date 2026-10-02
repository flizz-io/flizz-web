import { UserLifecycle } from '@/enums/user';
import type { TeamUser } from '@/types/team';
import { UserRole } from '@workspace/api-services';

/**
 * Who may do what to whom — mirrors the API's guards so the dashboard only
 * offers actions that will succeed (the API still enforces them itself).
 * Rules: docs/requirements/users-and-permissions.md.
 */
export function teamActionsFor(target: TeamUser, currentUserUuid: string) {
	const isSelf = target.uuid === currentUserUuid;
	const isSuperAdmin = target.role === UserRole.SUPER_ADMIN;
	// Role, status and removal: never on yourself, never on the Super Admin.
	const manageable = !isSelf && !isSuperAdmin;

	return {
		/** Designation and website settings — allowed on anyone. */
		canEdit: true,
		canChangeRole: manageable,
		roleLockedReason: isSelf ? 'self' : isSuperAdmin ? 'superAdmin' : null,
		canSuspend: manageable && target.lifecycle !== UserLifecycle.SUSPENDED,
		canReactivate:
			manageable && target.lifecycle === UserLifecycle.SUSPENDED,
		canRemove: manageable && target.canRemove,
		/** Permission grants exist only for Team Members. */
		canEditPermissions: manageable && target.role === UserRole.TEAM_MEMBER
	} as const;
}

export type TeamActions = ReturnType<typeof teamActionsFor>;
