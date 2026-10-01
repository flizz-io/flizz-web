/**
 * Where a user is in their account's life — derived, not stored: Invited until
 * the first sign-in, then Active, unless suspended. Only Invited users can be
 * removed. See docs/requirements/users-and-permissions.md.
 */
export enum UserLifecycle {
	INVITED = 'INVITED',
	ACTIVE = 'ACTIVE',
	SUSPENDED = 'SUSPENDED'
}
