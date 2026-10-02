import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'tsx prisma/seed.ts'
	},
	// Read loosely so `prisma generate` (run on install, CI included) works
	// without a database; migrate and seed fail clearly if it's unset.
	datasource: { url: process.env.DATABASE_URL }
});
