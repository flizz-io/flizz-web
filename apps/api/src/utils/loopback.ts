import { env } from '../configs/env.js';

const loopbackIps = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

/**
 * A request from this machine outside production — local development and the
 * e2e suite. Contact form limits skip it, so repeated test runs don't lock
 * the form; production never matches.
 */
export function isLocalDevRequest(ip: string | undefined) {
	return !env.isProduction && Boolean(ip && loopbackIps.includes(ip));
}
