import { z } from 'zod';

import { contactLimits } from '../constants/contact.js';
import { ContactScope, ContactStart } from '../generated/prisma/enums.js';

const limits = contactLimits;

/**
 * The website's form — the same rules as `apps/web/schemas/contact.ts`, which
 * only exists so visitors see errors without a round trip. This is the
 * authority.
 */
export const submitContactSchema = z.object({
	name: z.string().trim().min(limits.nameMin).max(limits.name),
	company: z
		.string()
		.trim()
		.max(limits.company)
		.nullish()
		.transform((value) => value || null),
	email: z
		.email()
		.max(limits.email)
		.transform((email) => email.toLowerCase()),
	scope: z.enum(ContactScope),
	start: z.enum(ContactStart),
	message: z.string().trim().min(limits.messageMin).max(limits.message),
	sourcePath: z
		.string()
		.trim()
		.max(limits.sourcePath)
		.startsWith('/')
		.nullish()
		.transform((value) => value || null),
	/** The honeypot — people never see it, so anything here is a bot. */
	website: z.string().max(500).optional(),
	turnstileToken: z.string().max(2048).optional()
});

export type SubmitContactInput = z.infer<typeof submitContactSchema>;
