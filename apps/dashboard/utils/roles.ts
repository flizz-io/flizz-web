import { UserRole } from '@/enums/user';

/** Super Admin and Admins — who manages the team. */
export function isAdminRole(role: UserRole) {
	return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
}
