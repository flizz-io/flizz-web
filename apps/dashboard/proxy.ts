import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import {
	homePath,
	loginPath,
	returnToParam,
	sessionCookieName,
	sessionExpiredPath
} from '@/constants/auth';

/**
 * Optimistic routing only — Next 16's Proxy is not an auth layer. A missing
 * session cookie goes to /login (remembering where it was headed); a present
 * one skips /login. Whether the session is actually valid is checked by the
 * protected layout against the API, and the API checks it again itself.
 */
export function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl;
	const hasSession = request.cookies.has(sessionCookieName);
	const onLogin = pathname === loginPath;

	// Clearing a dead session must run with or without a cookie.
	if (pathname === sessionExpiredPath) return NextResponse.next();

	if (!hasSession && !onLogin) {
		const url = new URL(loginPath, request.url);
		url.searchParams.set(returnToParam, pathname + search);
		return NextResponse.redirect(url);
	}

	if (hasSession && onLogin) {
		return NextResponse.redirect(new URL(homePath, request.url));
	}

	return NextResponse.next();
}

export const config = {
	// Everything except the API rewrite, Next internals and static files.
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo/).*)']
};
