import { Router } from 'express';

import { articleRouter } from './article-routes.js';
import { authRouter } from './auth-routes.js';
import { contactMessageRouter } from './contact-message-routes.js';
import { meRouter } from './me-routes.js';
import { projectRouter } from './project-routes.js';
import { publicRouter } from './public-routes.js';
import { serviceRouter } from './service-routes.js';
import { testimonialRouter } from './testimonial-routes.js';
import { userRouter } from './user-routes.js';
import { getHealth } from '../controllers/health-controller.js';

export const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRouter);
router.use('/me', meRouter);
router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/services', serviceRouter);
router.use('/articles', articleRouter);
router.use('/testimonials', testimonialRouter);
router.use('/contact-messages', contactMessageRouter);
router.use('/public', publicRouter);
