import type { NextFunction, Request, Response } from 'express';

import type { PermissionAction } from '../enums/permission-action.js';
import type { Feature } from '../generated/prisma/enums.js';
import { currentUserOf } from '../utils/current-user.js';
import { HttpError } from '../utils/http-error.js';
import { can } from '../utils/permissions.js';

/**
 * Guards a content-feature route: `requirePermission(Feature.PROJECTS,
 * PermissionAction.EDIT)`. Admins always pass; Team Members need the grant.
 * The API enforces this itself — the dashboard hiding a button is only a
 * convenience.
 */
export function requirePermission(feature: Feature, action: PermissionAction) {
	return (_req: Request, res: Response, next: NextFunction) => {
		if (!can(currentUserOf(res).permissions, feature, action)) {
			throw HttpError.forbidden();
		}

		next();
	};
}
