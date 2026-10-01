import 'dotenv/config';
import { z } from 'zod';

import { NodeEnv } from '../enums/node-env.js';

const DEFAULT_PORT = 3500;
const MIN_SESSION_SECRET_LENGTH = 32;

/** A comma-separated env value as a trimmed list, empties dropped. */
const commaList = z
	.string()
	.default('')
	.transform((value) =>
		value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean)
	);

const envSchema = z.object({
	NODE_ENV: z.enum(NodeEnv).default(NodeEnv.DEVELOPMENT),
	PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
	DATABASE_URL: z.url(),
	GOOGLE_CLIENT_ID: z.string().min(1),
	SESSION_SECRET: z.string().min(MIN_SESSION_SECRET_LENGTH),
	SUPER_ADMIN_EMAIL: z.email().transform((email) => email.toLowerCase()),
	CORS_ORIGINS: commaList
});

const parsed = envSchema.safeParse(process.env);

// Fail at start-up, by name, rather than on the first request that needs it.
if (!parsed.success) {
	const problems = parsed.error.issues
		.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
		.join('\n');
	console.error(
		`Invalid environment — check apps/api/.env against .env.example:\n${problems}`
	);
	process.exit(1);
}

const values = parsed.data;

export const env = {
	nodeEnv: values.NODE_ENV,
	isProduction: values.NODE_ENV === NodeEnv.PRODUCTION,
	port: values.PORT,
	databaseUrl: values.DATABASE_URL,
	googleClientId: values.GOOGLE_CLIENT_ID,
	sessionSecret: values.SESSION_SECRET,
	superAdminEmail: values.SUPER_ADMIN_EMAIL,
	corsOrigins: values.CORS_ORIGINS
} as const;
