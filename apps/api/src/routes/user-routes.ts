import { Router } from 'express';

import {
	createUser,
	getUser,
	listUsers,
	reactivateUser,
	removeUser,
	replacePermissions,
	suspendUser,
	updateUser
} from '../controllers/user-controller.js';
import { requireAdmin } from '../middlewares/require-admin.js';
import { requireAuth } from '../middlewares/require-auth.js';

/** Team management — Super Admin and Admins only. */
export const userRouter = Router();

userRouter.use(requireAuth, requireAdmin);

userRouter.get('/', listUsers);
userRouter.post('/', createUser);
userRouter.get('/:uuid', getUser);
userRouter.patch('/:uuid', updateUser);
userRouter.delete('/:uuid', removeUser);
userRouter.post('/:uuid/suspend', suspendUser);
userRouter.post('/:uuid/reactivate', reactivateUser);
userRouter.put('/:uuid/permissions', replacePermissions);
