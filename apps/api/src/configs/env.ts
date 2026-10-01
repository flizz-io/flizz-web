import 'dotenv/config';
import { z } from 'zod';

import { MediaProvider } from '../enums/media-provider.js';
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

/** `KEY=` in a .env file means "not set", not "set to nothing". */
const blankAsUnset = z
	.string()
	.trim()
	.optional()
	.transform((value) => value || undefined);

const baseEnvSchema = z.object({
	NODE_ENV: z.enum(NodeEnv).default(NodeEnv.DEVELOPMENT),
	PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
	DATABASE_URL: z.url(),
	GOOGLE_CLIENT_ID: z.string().min(1),
	SESSION_SECRET: z.string().min(MIN_SESSION_SECRET_LENGTH),
	SUPER_ADMIN_EMAIL: z.email().transform((email) => email.toLowerCase()),
	CORS_ORIGINS: commaList,
	MEDIA_PROVIDER: z.enum(MediaProvider).default(MediaProvider.CLOUDINARY),
	MEDIA_STORAGE_DIR: z.string().min(1).default('storage/media'),
	MEDIA_PUBLIC_BASE_URL: blankAsUnset.pipe(z.url().optional()),
	CLOUDINARY_CLOUD_NAME: blankAsUnset,
	CLOUDINARY_API_KEY: blankAsUnset,
	CLOUDINARY_API_SECRET: blankAsUnset,
	CLOUDINARY_FOLDER: z.string().min(1).default('flizz')
});

/** Each media provider's own settings, required only when it's in use. */
const providerRequirements: Record<MediaProvider, (keyof EnvInput)[]> = {
	[MediaProvider.CLOUDINARY]: [
		'CLOUDINARY_CLOUD_NAME',
		'CLOUDINARY_API_KEY',
		'CLOUDINARY_API_SECRET'
	],
	[MediaProvider.LOCAL]: ['MEDIA_PUBLIC_BASE_URL']
};

type EnvInput = z.infer<typeof baseEnvSchema>;

const envSchema = baseEnvSchema.superRefine((values, ctx) => {
	for (const key of providerRequirements[values.MEDIA_PROVIDER]) {
		if (!values[key]) {
			ctx.addIssue({
				code: 'custom',
				path: [key],
				message: `Required when MEDIA_PROVIDER=${values.MEDIA_PROVIDER}`
			});
		}
	}
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
	corsOrigins: values.CORS_ORIGINS,
	media: {
		provider: values.MEDIA_PROVIDER,
		storageDir: values.MEDIA_STORAGE_DIR,
		publicBaseUrl: values.MEDIA_PUBLIC_BASE_URL ?? '',
		cloudinary: {
			cloudName: values.CLOUDINARY_CLOUD_NAME ?? '',
			apiKey: values.CLOUDINARY_API_KEY ?? '',
			apiSecret: values.CLOUDINARY_API_SECRET ?? '',
			folder: values.CLOUDINARY_FOLDER
		}
	}
} as const;
