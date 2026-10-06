import { Router } from 'express';

import { uploadLimitsKb } from '../constants/media.js';
import {
	removeCover,
	removeOgImage,
	uploadBodyImage,
	uploadCover,
	uploadOgImage
} from '../controllers/article-media-controller.js';
import { PermissionAction } from '../enums/permission-action.js';
import { Feature } from '../generated/prisma/enums.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requirePermission } from '../middlewares/require-permission.js';
import { uploadImage } from '../middlewares/upload-image.js';

/** Articles — every route needs a session plus the `ARTICLES` grant. */
export const articleRouter = Router();

const canEdit = requirePermission(Feature.ARTICLES, PermissionAction.EDIT);
const uploadArticleImage = uploadImage(uploadLimitsKb.articleImage);
const uploadShareImage = uploadImage(uploadLimitsKb.shareImage);

articleRouter.use(requireAuth);

articleRouter.post('/:uuid/cover', canEdit, uploadArticleImage, uploadCover);
articleRouter.delete('/:uuid/cover', canEdit, removeCover);
articleRouter.post('/:uuid/og-image', canEdit, uploadShareImage, uploadOgImage);
articleRouter.delete('/:uuid/og-image', canEdit, removeOgImage);
articleRouter.post(
	'/:uuid/images',
	canEdit,
	uploadArticleImage,
	uploadBodyImage
);
