import { Router } from 'express';

import { getMe, googleSignIn, logout } from '../controllers/auth-controller.js';
import { signInLimiter } from '../middlewares/rate-limit.js';
import { requireAuth } from '../middlewares/require-auth.js';

export const authRouter = Router();

authRouter.post('/google', signInLimiter, googleSignIn);
authRouter.get('/me', requireAuth, getMe);
authRouter.post('/logout', logout);
