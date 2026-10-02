import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import {
	loginPath,
	loginReasonParam,
	sessionCookieName
} from '@/constants/auth';
import { LoginReason } from '@/enums/auth';

/**
 * Where the protected layout sends a session the API rejected (expired,
 * tampered with, or the admin was removed). Layouts can't clear cookies, and
 * left in place the dead cookie would make `proxy.ts` bounce /login straight
 * back — so it's cleared here before going to sign in.
 */
export function GET(request: NextRequest) {
	const url = new URL(loginPath, request.url);
	url.searchParams.set(loginReasonParam, LoginReason.EXPIRED);

	const response = NextResponse.redirect(url);
	response.cookies.delete(sessionCookieName);

	return response;
}
