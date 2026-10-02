import { PrismaPg } from '@prisma/adapter-pg';

import { env } from './env.js';
import { PrismaClient } from '../generated/prisma/client.js';

/**
 * The one database client for the whole API.
 *
 * Sessions are pinned to UTC: the Postgres adapter reads `timestamptz` values
 * as if they were UTC, so on a server whose timezone isn't UTC (a local
 * Postgres in Asia/Dhaka, for one) every timestamp came back hours off.
 *
 * Transactions get more room than Prisma's defaults (2s to start, 5s to run):
 * opening a fresh TLS connection to a far-away hosted database (Neon, from
 * a developer machine running migrations or the seed) can take longer than
 * two seconds on its own.
 */
export const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: env.databaseUrl,
		options: '-c timezone=UTC'
	}),
	transactionOptions: { maxWait: 10_000, timeout: 20_000 }
});
