import { verifyTurnstile } from './turnstile-service.js';
import { prisma } from '../configs/database.js';
import { contactIpLimit } from '../constants/contact.js';
import type { SubmitContactInput } from '../schemas/contact-schema.js';
import { HttpError } from '../utils/http-error.js';
import { hashIp } from '../utils/ip-hash.js';

/** Over `contactIpLimit` from this visitor in the window → 429. */
async function assertUnderIpLimit(ipHash: string | null) {
	if (!ipHash) return;

	const recent = await prisma.contactMessage.count({
		where: {
			ipHash,
			createdAt: { gte: new Date(Date.now() - contactIpLimit.windowMs) }
		}
	});

	if (recent >= contactIpLimit.limit) throw HttpError.tooManyRequests();
}

/**
 * Stores a Contact Us submission. A filled honeypot returns quietly without
 * storing anything — the bot gets the same answer as a person, so it learns
 * nothing. Returns the stored message, or `null` for a caught bot.
 */
export async function submitContactMessage(
	input: SubmitContactInput,
	ip: string | undefined
) {
	if (input.website) return null;

	const ipHash = hashIp(ip);
	await assertUnderIpLimit(ipHash);
	await verifyTurnstile(input.turnstileToken, ip);

	return prisma.contactMessage.create({
		data: {
			name: input.name,
			company: input.company,
			email: input.email,
			scope: input.scope,
			start: input.start,
			message: input.message,
			sourcePath: input.sourcePath,
			ipHash
		}
	});
}
