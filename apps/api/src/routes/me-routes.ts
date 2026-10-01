import { Router } from 'express';

import {
	getMyProfile,
	updateMyProfile
} from '../controllers/profile-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';

/** The signed-in user's own account — every role. */
export const meRouter = Router();

meRouter.use(requireAuth);

meRouter.get('/profile', getMyProfile);
meRouter.patch('/profile', updateMyProfile);
