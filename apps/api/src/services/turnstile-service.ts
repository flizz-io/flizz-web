import { env } from '../configs/env.js';
import {
	TURNSTILE_TIMEOUT_MS,
	turnstileVerifyUrl
} from '../constants/contact.js';
import { HttpError } from '../utils/http-error.js';

interface SiteverifyResponse {
	success: boolean;
	'error-codes'?: string[];
}

const failedMessage =
	'We couldn’t confirm you’re not a robot. Reload the page and try again.';

/**
 * Checks a Cloudflare Turnstile token. Without `TURNSTILE_SECRET_KEY` it's
 * off (local development); with it, a missing or rejected token is a 400 on
 * `turnstileToken`. Cloudflare being unreachable counts as a failure — the
 * visitor can retry, a bot can't sneak through an outage.
 */
export async function verifyTurnstile(
	token: string | undefined,
	ip: string | undefined
) {
	const secret = env.turnstileSecretKey;
	if (!secret) return;

	const fail = () =>
		HttpError.badRequest(failedMessage, [
			{ field: 'turnstileToken', message: failedMessage }
		]);

	if (!token) throw fail();

	const body = new URLSearchParams({ secret, response: token });
	if (ip) body.set('remoteip', ip);

	const result = await fetch(turnstileVerifyUrl, {
		method: 'POST',
		body,
		signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS)
	})
		.then((response) => response.json() as Promise<SiteverifyResponse>)
		.catch((error: unknown) => {
			console.warn(
				'Turnstile verification unreachable:',
				error instanceof Error ? error.message : error
			);
			return null;
		});

	if (!result?.success) {
		if (result) {
			console.warn(
				'Turnstile rejected a token:',
				result['error-codes']?.join(', ') ?? 'no reason given'
			);
		}
		throw fail();
	}
}
