import 'dotenv/config';

const DEFAULT_PORT = 3500;

export const env = {
	nodeEnv: process.env.NODE_ENV ?? 'development',
	port: Number(process.env.PORT ?? DEFAULT_PORT)
};
