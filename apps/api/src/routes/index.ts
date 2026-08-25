import { Router } from 'express';

import { getHealth } from '../controllers/health-controller.js';

export const router = Router();

router.get('/health', getHealth);
