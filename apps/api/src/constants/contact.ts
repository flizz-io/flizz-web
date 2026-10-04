import { ContactScope, ContactStart } from '../generated/prisma/enums.js';

const HOUR_MS = 3_600_000;

/** Field limits for contact messages — docs/requirements/contact-page.md#form-fields. */
export const contactLimits = {
	nameMin: 2,
	name: 120,
	company: 80,
	email: 254,
	messageMin: 20,
	message: 4000,
	sourcePath: 200,
	internalNote: 2000
} as const;

/**
 * Messages one visitor (by `ip_hash`) may send in the window. Counted in the
 * database, so it holds across serverless instances — unlike the in-memory
 * `publicFormLimiter`, which is the cheap first check.
 */
export const contactIpLimit = { windowMs: HOUR_MS, limit: 5 } as const;

/** Cloudflare's server-side token check. */
export const turnstileVerifyUrl =
	'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const TURNSTILE_TIMEOUT_MS = 5000;

/** Messages per page in the dashboard inbox. */
export const CONTACT_PAGE_SIZE = 25;

/** How long one notification channel may take before it's given up on. */
export const NOTIFY_TIMEOUT_MS = 5000;

/** Characters of the message quoted in a notification. */
export const NOTIFY_EXCERPT_LENGTH = 500;

/** The sender's display name; the address is always `SMTP_USER`. */
export const notifySenderName = 'Flizz website';

/** Port 465 speaks TLS from the start; others (587) upgrade with STARTTLS. */
export const SMTP_TLS_PORT = 465;

/** The dashboard's message route — `DASHBOARD_URL` + this + uuid. */
export const dashboardMessagePath = '/messages/';

/** The website's wording for each choice, for notifications. */
export const contactScopeLabels: Record<ContactScope, string> = {
	[ContactScope.NEW_BUILD]: 'Building something new',
	[ContactScope.REBUILD]: 'Replacing a system',
	[ContactScope.SCALE]: 'Scaling what works',
	[ContactScope.FIX]: 'Fixing what is broken',
	[ContactScope.UNDECIDED]: 'Still working it out'
};

export const contactStartLabels: Record<ContactStart, string> = {
	[ContactStart.IMMEDIATELY]: 'As soon as possible',
	[ContactStart.THIS_QUARTER]: 'This quarter',
	[ContactStart.NEXT_QUARTER]: 'Next quarter',
	[ContactStart.EXPLORING]: 'No date yet'
};
