import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './configs/env.js';
import { mediaRootDir, servesMediaLocally } from './configs/media.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { writeLimiter } from './middlewares/rate-limit.js';
import { router } from './routes/index.js';

export const app = express();

// Behind Vercel's proxy, `req.ip` (rate limits) must be the visitor's address
// from `X-Forwarded-For`, not the proxy's. Counted in hops so a visitor can't
// spoof it by sending their own header.
app.set('trust proxy', env.trustProxyHops);

// Security headers. Resources may be read cross-origin: the site loads
// images from `/api/media` when media is stored on this server.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// The dashboard reaches the API through its own `/api` rewrite, so it needs no
// CORS; only the public site's origins may read public endpoints cross-origin.
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());
app.use(cookieParser());

// Uploaded files, when stored on this server (MEDIA_PROVIDER=local); with
// Cloudinary they're served from its CDN instead. Keys are unique and never
// reused, so they can be cached forever; a missing file falls through to the
// API's JSON 404.
if (servesMediaLocally) {
	app.use(
		'/api/media',
		express.static(mediaRootDir, {
			immutable: true,
			maxAge: '365d',
			index: false
		})
	);
}
app.use('/api', writeLimiter);
app.use('/api', router);
app.use('/api', notFoundHandler);

app.use(errorHandler);
