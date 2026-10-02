import { z } from 'zod';

const NAME_MAX = 60;

/** An http(s) URL, or blank to clear it. */
const optionalLink = z
	.string()
	.trim()
	.transform((value) => value || null)
	.pipe(
		z
			.url({
				protocol: /^https?$/,
				message: 'Enter a full http(s) link.'
			})
			.nullable()
	)
	.nullable();

const optionalName = z
	.string()
	.trim()
	.max(NAME_MAX)
	.transform((value) => value || null)
	.nullable();

/** What a user may change about themselves. Designation is admin-set. */
export const updateProfileSchema = z
	.object({
		firstName: optionalName,
		lastName: optionalName,
		linkedinUrl: optionalLink,
		xUrl: optionalLink,
		portfolioUrl: optionalLink
	})
	.partial();
