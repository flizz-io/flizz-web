import { z } from 'zod';

/** What the dashboard posts after Google's button hands it an ID token. */
export const googleSignInSchema = z.object({
	credential: z.string().min(1, 'Google credential is required.')
});
