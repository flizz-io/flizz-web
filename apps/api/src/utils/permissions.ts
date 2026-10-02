import { PermissionAction } from '../enums/permission-action.js';
import type { UserPermission } from '../generated/prisma/client.js';
import { Feature, UserRole } from '../generated/prisma/enums.js';
import type { FeatureGrant, PermissionMap } from '../types/user.js';

const NONE: FeatureGrant = {
	create: false,
	view: false,
	edit: false,
	delete: false
};
const ALL: FeatureGrant = {
	create: true,
	view: true,
	edit: true,
	delete: true
};

const ACTION_KEY: Record<PermissionAction, keyof FeatureGrant> = {
	[PermissionAction.CREATE]: 'create',
	[PermissionAction.VIEW]: 'view',
	[PermissionAction.EDIT]: 'edit',
	[PermissionAction.DELETE]: 'delete'
};

export function isAdminRole(role: UserRole) {
	return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
}

/**
 * Applies "Create, Edit and Delete imply View": any of them turns View on;
 * View off turns everything off. So a grant is never a state where someone
 * can change what they can't see.
 */
export function normaliseGrant(grant: FeatureGrant): FeatureGrant {
	const view = grant.view || grant.create || grant.edit || grant.delete;

	return view ? { ...grant, view } : NONE;
}

/** The full permission map for a user — every feature, all-true for admins. */
export function permissionMap(
	role: UserRole,
	rows: Pick<
		UserPermission,
		'feature' | 'canCreate' | 'canView' | 'canEdit' | 'canDelete'
	>[]
): PermissionMap {
	const admin = isAdminRole(role);
	const byFeature = new Map(rows.map((row) => [row.feature, row]));

	return Object.fromEntries(
		Object.values(Feature).map((feature) => {
			if (admin) return [feature, ALL];

			const row = byFeature.get(feature);
			return [
				feature,
				row
					? normaliseGrant({
							create: row.canCreate,
							view: row.canView,
							edit: row.canEdit,
							delete: row.canDelete
						})
					: NONE
			];
		})
	) as PermissionMap;
}

export function can(
	permissions: PermissionMap,
	feature: Feature,
	action: PermissionAction
) {
	return permissions[feature][ACTION_KEY[action]];
}
