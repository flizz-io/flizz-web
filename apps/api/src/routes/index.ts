import { Router } from 'express';

import { authRouter } from './auth-routes.js';
import { meRouter } from './me-routes.js';
import { projectRouter } from './project-routes.js';
import { publicRouter } from './public-routes.js';
import { userRouter } from './user-routes.js';
import { getHealth } from '../controllers/health-controller.js';

export const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRouter);
router.use('/me', meRouter);
router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/public', publicRouter);
