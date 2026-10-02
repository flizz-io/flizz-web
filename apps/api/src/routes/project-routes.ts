import { Router } from 'express';

import { uploadLimitsKb } from '../constants/media.js';
import {
	createProject,
	deleteProject,
	getProject,
	listProjects,
	updateProject
} from '../controllers/project-controller.js';
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

const canView = requirePermission(Feature.PROJECTS, PermissionAction.VIEW);
const canCreate = requirePermission(Feature.PROJECTS, PermissionAction.CREATE);
const canEdit = requirePermission(Feature.PROJECTS, PermissionAction.EDIT);
const canDelete = requirePermission(Feature.PROJECTS, PermissionAction.DELETE);
const uploadProjectImage = uploadImage(uploadLimitsKb.projectImage);

projectRouter.use(requireAuth);

projectRouter.get('/', canView, listProjects);
projectRouter.post('/', canCreate, createProject);
projectRouter.get('/:uuid', canView, getProject);
projectRouter.patch('/:uuid', canEdit, updateProject);
projectRouter.delete('/:uuid', canDelete, deleteProject);

// Images.
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
