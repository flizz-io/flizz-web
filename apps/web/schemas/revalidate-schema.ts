import { z } from 'zod';

import { CacheTag } from '@/constants/cache';

/** `POST /api/revalidate` — which kinds of content changed. */
export const revalidateSchema = z.object({
	tags: z.array(z.enum(CacheTag)).min(1)
});
