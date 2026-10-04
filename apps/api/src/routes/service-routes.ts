import { Router } from 'express';

import { uploadLimitsKb } from '../constants/media.js';
import {
	createService,
	deleteService,
	getService,
	getServiceOptions,
	listServices,
	removeOgImage,
	reorderServiceList,
	updateService,
	uploadOgImage
} from '../controllers/service-controller.js';
import { PermissionAction } from '../enums/permission-action.js';
import { Feature } from '../generated/prisma/enums.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requirePermission } from '../middlewares/require-permission.js';
import { uploadImage } from '../middlewares/upload-image.js';

/** Services — every route needs a session plus the `SERVICES` grant. */
export const serviceRouter = Router();

const canView = requirePermission(Feature.SERVICES, PermissionAction.VIEW);
const canCreate = requirePermission(Feature.SERVICES, PermissionAction.CREATE);
const canEdit = requirePermission(Feature.SERVICES, PermissionAction.EDIT);
const canDelete = requirePermission(Feature.SERVICES, PermissionAction.DELETE);
// The project form's dropdown — editing a project doesn't need `SERVICES`.
const canViewProjects = requirePermission(
	Feature.PROJECTS,
	PermissionAction.VIEW
);
const uploadShareImage = uploadImage(uploadLimitsKb.shareImage);

serviceRouter.use(requireAuth);

serviceRouter.get('/', canView, listServices);
serviceRouter.post('/', canCreate, createService);
// Before `/:uuid`.
serviceRouter.get('/options', canViewProjects, getServiceOptions);
serviceRouter.put('/order', canEdit, reorderServiceList);
serviceRouter.get('/:uuid', canView, getService);
serviceRouter.patch('/:uuid', canEdit, updateService);
serviceRouter.delete('/:uuid', canDelete, deleteService);

serviceRouter.post('/:uuid/og-image', canEdit, uploadShareImage, uploadOgImage);
serviceRouter.delete('/:uuid/og-image', canEdit, removeOgImage);
