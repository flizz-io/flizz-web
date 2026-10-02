import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

import { revalidateSchema } from '@/schemas/revalidate-schema';

const BEARER_PREFIX = 'Bearer ';

/** Constant-time, so the secret can't be guessed a character at a time. */
function isAuthorised(header: string | null) {
	const secret = process.env.REVALIDATE_SECRET;
	if (!secret || !header?.startsWith(BEARER_PREFIX)) return false;

	const given = Buffer.from(header.slice(BEARER_PREFIX.length));
	const expected = Buffer.from(secret);

	return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Called by the API after a dashboard change: expires the named cache tags
 * so the pages built from them refetch on their next request. Needs
 * `Authorization: Bearer <REVALIDATE_SECRET>`; refuses everything when the
 * secret isn't configured.
 */
export async function POST(request: NextRequest) {
	if (!isAuthorised(request.headers.get('authorization'))) {
		return Response.json({ error: 'Unauthorised' }, { status: 401 });
	}

	const body = revalidateSchema.safeParse(
		await request.json().catch(() => null)
	);
	if (!body.success) {
		return Response.json({ error: 'Invalid tags' }, { status: 400 });
	}

	for (const tag of body.data.tags) {
		// Expire now rather than serve stale once — an editor checking the
		// site right after saving should see the change.
		revalidateTag(tag, { expire: 0 });
	}

	return Response.json({ revalidated: body.data.tags });
}
