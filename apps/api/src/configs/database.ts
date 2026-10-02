import { PrismaPg } from '@prisma/adapter-pg';

import { env } from './env.js';
import { PrismaClient } from '../generated/prisma/client.js';

/**
 * The one database client for the whole API.
 *
 * Sessions are pinned to UTC: the Postgres adapter reads `timestamptz` values
 * as if they were UTC, so on a server whose timezone isn't UTC (a local
 * Postgres in Asia/Dhaka, for one) every timestamp came back hours off.
 */
export const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: env.databaseUrl,
		options: '-c timezone=UTC'
	})
});
