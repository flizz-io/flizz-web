import { Router } from 'express';

import { getMe, googleSignIn, logout } from '../controllers/auth-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';

export const authRouter = Router();

authRouter.post('/google', googleSignIn);
authRouter.get('/me', requireAuth, getMe);
authRouter.post('/logout', logout);
