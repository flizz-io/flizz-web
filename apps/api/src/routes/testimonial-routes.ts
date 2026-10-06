import { Router } from 'express';

import {
	createTestimonial,
	deleteTestimonial,
	getTestimonial,
	getTestimonialProjectOptions,
	listTestimonials,
	reorderTestimonialList,
	updateTestimonial
} from '../controllers/testimonial-controller.js';
import { PermissionAction } from '../enums/permission-action.js';
import { Feature } from '../generated/prisma/enums.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requirePermission } from '../middlewares/require-permission.js';

/** Testimonials — every route needs a session plus the `TESTIMONIALS` grant. */
export const testimonialRouter = Router();

const canView = requirePermission(Feature.TESTIMONIALS, PermissionAction.VIEW);
const canCreate = requirePermission(
	Feature.TESTIMONIALS,
	PermissionAction.CREATE
);
const canEdit = requirePermission(Feature.TESTIMONIALS, PermissionAction.EDIT);
const canDelete = requirePermission(
	Feature.TESTIMONIALS,
	PermissionAction.DELETE
);

testimonialRouter.use(requireAuth);

testimonialRouter.get('/', canView, listTestimonials);
testimonialRouter.post('/', canCreate, createTestimonial);
// Before `/:uuid`.
testimonialRouter.get(
	'/project-options',
	canView,
	getTestimonialProjectOptions
);
testimonialRouter.put('/order', canEdit, reorderTestimonialList);
testimonialRouter.get('/:uuid', canView, getTestimonial);
testimonialRouter.patch('/:uuid', canEdit, updateTestimonial);
testimonialRouter.delete('/:uuid', canDelete, deleteTestimonial);
