import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { env } from './configs/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { router } from './routes/index.js';

export const app = express();

// The dashboard reaches the API through its own `/api` rewrite, so it needs no
// CORS; only the public site's origins may read public endpoints cross-origin.
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);
app.use('/api', notFoundHandler);

app.use(errorHandler);
