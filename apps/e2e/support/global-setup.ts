import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { createAdminSession, type AdminSession } from './admin-session';
import { adminStatePath, appUrls, warmUpRoutes } from './urls';

/** The apps must already be running — `pnpm dev` at the repo root. */
async function assertRunning() {
	const checks = [
		{ name: 'api', url: `${appUrls.api}/api/health` },
		{ name: 'web', url: appUrls.web },
		{ name: 'dashboard', url: `${appUrls.dashboard}/login` }
	];

	for (const { name, url } of checks) {
		const ok = await fetch(url).then(
			(response) => response.ok,
			() => false
		);
		if (!ok) {
			throw new Error(
				`${name} isn't answering at ${url} — start the apps with \`pnpm dev\` first.`
			);
		}
	}
}

/**
 * Cookies ignore ports, so one `localhost` cookie signs the admin in to the
 * dashboard (3400, through its /api rewrite) and the API (3500) alike.
 */
async function writeAdminState(): Promise<AdminSession> {
	const adminSession = await createAdminSession();
	const { cookieName, token, expiresAt } = adminSession;
	const state = {
		cookies: [
			{
				name: cookieName,
				value: token,
				domain: 'localhost',
				path: '/',
				expires: expiresAt,
				httpOnly: true,
				secure: false,
				sameSite: 'Lax'
			}
		],
		origins: []
	};

	await mkdir(dirname(adminStatePath), { recursive: true });
	await writeFile(adminStatePath, JSON.stringify(state, null, '\t'));
	return adminSession;
}

/**
 * A dev server compiles each route on its first visit and can reload the
 * page mid-navigation, which fails the test that happened to get there
 * first. Visiting every route once up front keeps that out of the results.
 */
async function warmRoutes({ cookieName, token }: AdminSession) {
	const cookie = `${cookieName}=${token}`;
	const routes: { url: string; headers?: HeadersInit }[] = [
		...warmUpRoutes.web.map((path) => ({ url: `${appUrls.web}${path}` })),
		...warmUpRoutes.dashboard.map((path) => ({
			url: `${appUrls.dashboard}${path}`,
			headers: { cookie }
		}))
	];

	await Promise.all(
		routes.map(({ url, headers }) =>
			fetch(url, { headers, redirect: 'manual' }).catch(() => undefined)
		)
	);
}

export default async function globalSetup() {
	await assertRunning();
	await warmRoutes(await writeAdminState());
}
