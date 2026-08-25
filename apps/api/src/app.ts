import cors from 'cors';
import express from 'express';

import { errorHandler } from './middlewares/error-handler.js';
import { router } from './routes/index.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.use(errorHandler);
