import { LoginReason } from '@/enums/auth';

/** Copy for the sign-in page — see docs/requirements/dashboard-auth.md. */
export const loginMessages = {
	title: 'Sign in to Flizz Admin',
	lead: 'Use your Google account. Only approved accounts can sign in.',
	noAccess:
		"This Google account doesn't have access. Ask an admin to add you.",
	googleFailed: "Google sign-in didn't complete. Try again.",
	unreachable: "Can't reach the server right now. Try again in a moment.",
	notConfigured:
		'Google sign-in is not configured — set NEXT_PUBLIC_GOOGLE_CLIENT_ID.',
	reasons: {
		[LoginReason.EXPIRED]: 'Your session ended. Sign in again.'
	} satisfies Record<LoginReason, string>
} as const;

export const shellMessages = {
	signOut: 'Sign out',
	myProfile: 'My profile',
	overviewTitle: 'Overview',
	overviewLead:
		"You're signed in. Content management screens land here feature by feature — Projects first."
} as const;
