import { homePath } from '@/constants/auth';

/**
 * The page to return to after signing in — only ever a path on this site.
 * Anything else (`//evil.com`, `https://…`) falls back to the home page, so
 * the sign-in page can't be used as an open redirect.
 */
export function safeReturnPath(value: string | null | undefined) {
	if (!value || !value.startsWith('/') || value.startsWith('//')) {
		return homePath;
	}

	return value;
}
