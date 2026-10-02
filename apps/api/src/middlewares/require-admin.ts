import type { NextFunction, Request, Response } from 'express';

import { currentUserOf } from '../utils/current-user.js';
import { HttpError } from '../utils/http-error.js';
import { isAdminRole } from '../utils/permissions.js';

/** Super Admin and Admins only — team management is never grantable. */
export function requireAdmin(_req: Request, res: Response, next: NextFunction) {
	if (!isAdminRole(currentUserOf(res).role)) throw HttpError.forbidden();

	next();
}
