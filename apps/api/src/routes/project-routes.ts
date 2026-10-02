import { Router } from 'express';

import { uploadLimitsKb } from '../constants/media.js';
import {
	removeCover,
	removeGalleryImage,
	reorderGalleryImages,
	updateGalleryImage,
	uploadCover,
	uploadGalleryImage
} from '../controllers/project-image-controller.js';
import { PermissionAction } from '../enums/permission-action.js';
import { Feature } from '../generated/prisma/enums.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requirePermission } from '../middlewares/require-permission.js';
import { uploadImage } from '../middlewares/upload-image.js';

/** Projects — every route needs a session plus the `PROJECTS` grant. */
export const projectRouter = Router();

const canEdit = requirePermission(Feature.PROJECTS, PermissionAction.EDIT);
const uploadProjectImage = uploadImage(uploadLimitsKb.projectImage);

projectRouter.use(requireAuth);

// Images (C3). Project CRUD routes (C4) join below.
projectRouter.post('/:uuid/cover', canEdit, uploadProjectImage, uploadCover);
projectRouter.delete('/:uuid/cover', canEdit, removeCover);
projectRouter.post(
	'/:uuid/gallery',
	canEdit,
	uploadProjectImage,
	uploadGalleryImage
);
projectRouter.put('/:uuid/gallery/order', canEdit, reorderGalleryImages);
projectRouter.patch('/:uuid/gallery/:imageUuid', canEdit, updateGalleryImage);
projectRouter.delete('/:uuid/gallery/:imageUuid', canEdit, removeGalleryImage);
