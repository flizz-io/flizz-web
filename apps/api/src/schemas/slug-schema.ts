import { z } from 'zod';

import { maxSlugLength, slugPattern } from '../constants/slug.js';

/** A record's URL segment — trimmed and lower-cased before it's checked. */
export const slugSchema = z
	.string()
	.trim()
	.toLowerCase()
	.max(maxSlugLength)
	.regex(slugPattern, 'Use lower-case letters, digits and single hyphens.');
