import { config } from 'dotenv';
import { SignJWT } from 'jose';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

/**
 * Must match the API — apps/api/src/constants/auth.ts and
 * apps/api/src/services/session-service.ts.
 */
const session = {
	cookieName: 'flizz_admin_session',
	issuer: 'flizz-api',
	audience: 'flizz-dashboard',
	algorithm: 'HS256',
	ttlSeconds: 60 * 60
} as const;

const localHosts = ['localhost', '127.0.0.1', '::1'];

const apiEnvPath = fileURLToPath(new URL('../../api/.env', import.meta.url));

export interface AdminSession {
	cookieName: string;
	token: string;
	expiresAt: number;
}

/**
 * Signs the local Super Admin in without Google: reads the API's own `.env`,
 * finds `SUPER_ADMIN_EMAIL` in the database and signs a session token with
 * `SESSION_SECRET`, exactly as `POST /api/auth/google` would. Refuses any
 * database that isn't on this machine, so a test run never writes to a
 * hosted one.
 */
export async function createAdminSession(): Promise<AdminSession> {
	const { parsed = {} } = config({ path: apiEnvPath, quiet: true });
	const { DATABASE_URL, SESSION_SECRET, SUPER_ADMIN_EMAIL } = parsed;

	if (!DATABASE_URL || !SESSION_SECRET || !SUPER_ADMIN_EMAIL) {
		throw new Error(
			`DATABASE_URL, SESSION_SECRET and SUPER_ADMIN_EMAIL must be set in ${apiEnvPath}.`
		);
	}

	const { hostname } = new URL(DATABASE_URL);
	if (!localHosts.includes(hostname)) {
		throw new Error(
			`E2E tests only run against a local database; apps/api/.env points at "${hostname}".`
		);
	}

	const client = new pg.Client({ connectionString: DATABASE_URL });
	await client.connect();
	const { rows } = await client
		.query<{ uuid: string }>(
			'SELECT uuid FROM users WHERE email = $1 AND deleted_at IS NULL',
			[SUPER_ADMIN_EMAIL.toLowerCase()]
		)
		.finally(() => client.end());

	const adminUuid = rows[0]?.uuid;
	if (!adminUuid) {
		throw new Error(
			`No user ${SUPER_ADMIN_EMAIL} in the local database — run \`pnpm --filter api db:seed\`.`
		);
	}

	const token = await new SignJWT({})
		.setProtectedHeader({ alg: session.algorithm })
		.setSubject(adminUuid)
		.setIssuer(session.issuer)
		.setAudience(session.audience)
		.setIssuedAt()
		.setExpirationTime(`${session.ttlSeconds}s`)
		.sign(new TextEncoder().encode(SESSION_SECRET));

	return {
		cookieName: session.cookieName,
		token,
		expiresAt: Math.floor(Date.now() / 1000) + session.ttlSeconds
	};
}
