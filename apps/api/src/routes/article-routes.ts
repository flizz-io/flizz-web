import { Router } from 'express';

import { uploadLimitsKb } from '../constants/media.js';
import {
	createArticle,
	deleteArticle,
	getArticle,
	getArticleAuthors,
	getArticleTags,
	listArticles,
	updateArticle
} from '../controllers/article-controller.js';
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

const canView = requirePermission(Feature.ARTICLES, PermissionAction.VIEW);
const canCreate = requirePermission(Feature.ARTICLES, PermissionAction.CREATE);
const canEdit = requirePermission(Feature.ARTICLES, PermissionAction.EDIT);
const canDelete = requirePermission(Feature.ARTICLES, PermissionAction.DELETE);
const uploadArticleImage = uploadImage(uploadLimitsKb.articleImage);
const uploadShareImage = uploadImage(uploadLimitsKb.shareImage);

articleRouter.use(requireAuth);

articleRouter.get('/', canView, listArticles);
articleRouter.post('/', canCreate, createArticle);
// Before `/:uuid`.
articleRouter.get('/tags', canView, getArticleTags);
articleRouter.get('/authors', canView, getArticleAuthors);
articleRouter.get('/:uuid', canView, getArticle);
articleRouter.patch('/:uuid', canEdit, updateArticle);
articleRouter.delete('/:uuid', canDelete, deleteArticle);

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
