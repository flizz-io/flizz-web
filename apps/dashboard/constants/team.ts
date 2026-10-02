import { UserLifecycle, UserRole } from '@/enums/user';

export const roleLabels: Record<UserRole, string> = {
	[UserRole.SUPER_ADMIN]: 'Super Admin',
	[UserRole.ADMIN]: 'Admin',
	[UserRole.TEAM_MEMBER]: 'Team Member'
};

export const lifecycleLabels: Record<UserLifecycle, string> = {
	[UserLifecycle.INVITED]: 'Invited',
	[UserLifecycle.ACTIVE]: 'Active',
	[UserLifecycle.SUSPENDED]: 'Suspended'
};

/** Roles an admin can give — Super Admin comes only from setup. */
export const assignableRoles = [UserRole.TEAM_MEMBER, UserRole.ADMIN] as const;

/** "Any" option for the filters. */
export const allFilterValue = 'ALL';

export const teamMessages = {
	title: 'Team',
	lead: 'Everyone who can sign in to the dashboard. People join only when an admin adds their email.',
	addMember: 'Add member',
	addTitle: 'Add a team member',
	addLead:
		'They can sign in with this Google account straight away. Team Members start with no feature access — grant it from their permissions.',
	emailLabel: 'Google account email',
	roleLabel: 'Role',
	designationLabel: 'Designation',
	designationPlaceholder: 'e.g. Senior Frontend Engineer',
	optional: '(optional)',
	cancel: 'Cancel',
	added: (email: string) => `${email} can now sign in.`,
	searchPlaceholder: 'Search name or email',
	anyRole: 'All roles',
	anyStatus: 'All statuses',
	noResults: 'No one matches these filters.',
	neverSignedIn: 'Not signed in yet',
	you: 'You',
	columns: {
		member: 'Member',
		role: 'Role',
		designation: 'Designation',
		status: 'Status',
		lastSignIn: 'Last sign-in'
	}
} as const;
