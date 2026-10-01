import { Router } from 'express';

import {
	getMyProfile,
	removeMyPhoto,
	updateMyProfile,
	uploadMyPhoto
} from '../controllers/profile-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { uploadImage } from '../middlewares/upload-image.js';

/** The signed-in user's own account — every role. */
export const meRouter = Router();

meRouter.use(requireAuth);

meRouter.get('/profile', getMyProfile);
meRouter.patch('/profile', updateMyProfile);
meRouter.post('/photo', uploadImage, uploadMyPhoto);
meRouter.delete('/photo', removeMyPhoto);
