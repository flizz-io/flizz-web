import { PrismaPg } from '@prisma/adapter-pg';

import { env } from './env.js';
import { PrismaClient } from '../generated/prisma/client.js';

/** The one database client for the whole API. */
export const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: env.databaseUrl })
});
