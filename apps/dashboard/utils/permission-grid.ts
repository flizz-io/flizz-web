import { featureOrder, grantActions } from '@/constants/permissions';
import type { GrantAction } from '@/constants/permissions';
import type {
	Feature,
	FeatureGrant,
	PermissionMap
} from '@workspace/api-services';

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

/**
 * One checkbox changed, with the API's rule applied straight away: Create,
 * Edit and Delete imply View, and clearing View clears the rest. The grid
 * never shows a state the API would reshape on save.
 */
export function toggleGrant(
	grant: FeatureGrant,
	action: GrantAction,
	checked: boolean
): FeatureGrant {
	if (action === 'view') return checked ? { ...grant, view: true } : NONE;

	return { ...grant, [action]: checked, view: checked ? true : grant.view };
}

export function setAllGrants(checked: boolean): FeatureGrant {
	return checked ? ALL : NONE;
}

/** All four on: true; none: false; some: 'indeterminate' (the row's All box). */
export function grantSummary(grant: FeatureGrant): boolean | 'indeterminate' {
	const on = grantActions.filter((action) => grant[action]).length;

	return on === grantActions.length
		? true
		: on === 0
			? false
			: 'indeterminate';
}

export function sameGrid(a: PermissionMap, b: PermissionMap) {
	return featureOrder.every((feature: Feature) =>
		grantActions.every(
			(action) => a[feature][action] === b[feature][action]
		)
	);
}
