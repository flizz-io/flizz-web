import { createHmac } from 'node:crypto';

import { env } from '../configs/env.js';

/**
 * A keyed hash of the visitor's IP — enough to spot repeat senders without
 * storing the address. Rotating `SESSION_SECRET` only resets the counts.
 */
export function hashIp(ip: string | undefined) {
	if (!ip) return null;

	return createHmac('sha256', env.sessionSecret)
		.update(`contact-ip:${ip}`)
		.digest('hex');
}
