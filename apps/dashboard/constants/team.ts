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
	actions: {
		menuLabel: (name: string) => `Actions for ${name}`,
		edit: 'Edit',
		suspend: 'Suspend',
		reactivate: 'Reactivate',
		remove: 'Remove'
	},
	edit: {
		title: (name: string) => `Edit ${name}`,
		lead: 'Role, designation, and how they appear on the website.',
		websiteSection: 'About page',
		showOnWebsite: 'Show on the website',
		showOnWebsiteHint: 'Lists them in the About page team section.',
		isFounder: 'Founder',
		isFounderHint: 'Shows the founder badge on their card.',
		displayOrder: 'Display order',
		displayOrderHint: 'Lower numbers appear first.',
		roleLocked: {
			self: "You can't change your own role.",
			superAdmin: 'The Super Admin role changes only in setup.'
		},
		save: 'Save changes',
		saved: (name: string) => `${name} updated.`,
		createdBy: (name: string, when: string) => `Added by ${name} · ${when}`,
		createdBySetup: (when: string) => `Added in setup · ${when}`,
		updatedBy: (name: string, when: string) =>
			`Last changed by ${name} · ${when}`
	},
	confirm: {
		suspendTitle: (name: string) => `Suspend ${name}?`,
		suspendBody:
			'They are signed out on their next request and can’t sign in until reactivated. Everything they created keeps their name.',
		suspended: (name: string) => `${name} is suspended.`,
		reactivateTitle: (name: string) => `Reactivate ${name}?`,
		reactivateBody:
			'They can sign in again, with the same role and permissions as before.',
		reactivated: (name: string) => `${name} can sign in again.`,
		removeTitle: (name: string) => `Remove ${name}?`,
		removeBody:
			'They haven’t signed in yet, so they can be removed. Adding the same email later restores them.',
		removed: (name: string) => `${name} was removed.`,
		cancel: 'Cancel'
	},
	columns: {
		member: 'Member',
		role: 'Role',
		designation: 'Designation',
		status: 'Status',
		lastSignIn: 'Last sign-in',
		actions: 'Actions'
	}
} as const;
