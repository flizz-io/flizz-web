import { z } from 'zod';

import { ProjectScope, ProjectStart } from '@/enums/contact';

/**
 * Messages are written to be read next to the field they belong to, so they
 * say what to do rather than what failed. Each one has to work for a blank
 * field and a malformed one alike — the form never distinguishes between them.
 */
export const contactFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, { error: 'Add your name, so we know who we are replying to.' }),
	company: z
		.string()
		.trim()
		.max(80, { error: 'That is longer than a company name we can store.' }),
	email: z.email({ error: 'Add an address we can reply to.' }),
	scope: z.enum(ProjectScope, {
		error: 'Pick the line closest to your project.'
	}),
	start: z.enum(ProjectStart, {
		error: 'Pick roughly when you want to begin.'
	}),
	message: z
		.string()
		.trim()
		.min(20, { error: 'A couple of sentences is enough to work with.' })
		.max(4000, {
			error: 'Save the rest for the call — this is over length.'
		})
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;
