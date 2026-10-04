import { Router } from 'express';

import {
	deleteContactMessage,
	getContactMessage,
	getContactMessages,
	getContactMessageSummary,
	updateContactMessage
} from '../controllers/contact-message-controller.js';
import { PermissionAction } from '../enums/permission-action.js';
import { Feature } from '../generated/prisma/enums.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requirePermission } from '../middlewares/require-permission.js';

/** The contact inbox — a session plus the `CONTACT_MESSAGES` grant. */
export const contactMessageRouter = Router();

const canView = requirePermission(
	Feature.CONTACT_MESSAGES,
	PermissionAction.VIEW
);
const canEdit = requirePermission(
	Feature.CONTACT_MESSAGES,
	PermissionAction.EDIT
);
const canDelete = requirePermission(
	Feature.CONTACT_MESSAGES,
	PermissionAction.DELETE
);

contactMessageRouter.use(requireAuth);

contactMessageRouter.get('/', canView, getContactMessages);
// Before `/:uuid`.
contactMessageRouter.get('/summary', canView, getContactMessageSummary);
contactMessageRouter.get('/:uuid', canView, getContactMessage);
contactMessageRouter.patch('/:uuid', canEdit, updateContactMessage);
contactMessageRouter.delete('/:uuid', canDelete, deleteContactMessage);
