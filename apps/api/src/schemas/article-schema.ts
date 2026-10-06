import { z } from 'zod';

export const articleUuidSchema = z.object({ uuid: z.uuid() });
