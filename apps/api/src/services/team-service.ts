import { prisma } from '../configs/database.js';
import { UserLifecycle } from '../enums/user-lifecycle.js';
import type { Prisma } from '../generated/prisma/client.js';
import {
	type Feature,
	UserRole,
	UserStatus
} from '../generated/prisma/enums.js';
import type { TeamUserResponse } from '../types/team.js';
import type { CurrentUser, FeatureGrant } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';
import { normaliseGrant, permissionMap } from '../utils/permissions.js';
import { toUserReference } from '../utils/user-display.js';

const referenceFields = {
	select: { uuid: true, email: true, firstName: true, lastName: true }
} as const;

const teamUserInclude = {
	permissions: true,
	createdBy: referenceFields,
	updatedBy: referenceFields,
	suspendedBy: referenceFields
} satisfies Prisma.UserInclude;

type TeamUser = Prisma.UserGetPayload<{ include: typeof teamUserInclude }>;

function lifecycleOf(user: Pick<TeamUser, 'status' | 'firstLoginAt'>) {
	if (user.status === UserStatus.SUSPENDED) return UserLifecycle.SUSPENDED;

	return user.firstLoginAt ? UserLifecycle.ACTIVE : UserLifecycle.INVITED;
}

function toTeamUserResponse(user: TeamUser): TeamUserResponse {
	return {
		uuid: user.uuid,
		email: user.email,
		role: user.role,
		lifecycle: lifecycleOf(user),
		firstName: user.firstName,
		lastName: user.lastName,
		designation: user.designation,
		avatarUrl: user.photoUrl ?? user.googleAvatarUrl,
		linkedinUrl: user.linkedinUrl,
		xUrl: user.xUrl,
		portfolioUrl: user.portfolioUrl,
		showOnWebsite: user.showOnWebsite,
		isFounder: user.isFounder,
		displayOrder: user.displayOrder,
		canRemove: !user.firstLoginAt,
		permissions: permissionMap(user.role, user.permissions),
		firstLoginAt: user.firstLoginAt?.toISOString() ?? null,
		lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
		suspendedAt: user.suspendedAt?.toISOString() ?? null,
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
		createdBy: toUserReference(user.createdBy),
		updatedBy: toUserReference(user.updatedBy),
		suspendedBy: toUserReference(user.suspendedBy)
	};
}

const ROLE_ORDER: Record<UserRole, number> = {
	[UserRole.SUPER_ADMIN]: 0,
	[UserRole.ADMIN]: 1,
	[UserRole.TEAM_MEMBER]: 2
};

/** A live (not removed) user by public id, or 404. */
async function findTeamUser(uuid: string) {
	const user = await prisma.user.findFirst({
		where: { uuid, deletedAt: null },
		include: teamUserInclude
	});
	if (!user) throw HttpError.notFound('No such team member.');

	return user;
}

/**
 * The guards every management action shares: nobody acts on themselves (so
 * no one locks themselves out), and the Super Admin is untouchable — changing
 * who that is happens only through `SUPER_ADMIN_EMAIL` and the seed.
 */
function assertManageable(actor: CurrentUser, target: TeamUser) {
	if (target.id === actor.id) {
		throw HttpError.forbidden("You can't change this on your own account.");
	}
	if (target.role === UserRole.SUPER_ADMIN) {
		throw HttpError.forbidden(
			'The Super Admin can only be changed in setup.'
		);
	}
}

export interface ListUsersFilters {
	search?: string;
	role?: UserRole;
	lifecycle?: UserLifecycle;
}

export async function listTeamUsers(filters: ListUsersFilters) {
	const search = filters.search
		? {
				OR: (['email', 'firstName', 'lastName'] as const).map(
					(field) => ({
						[field]: {
							contains: filters.search,
							mode: 'insensitive' as const
						}
					})
				)
			}
		: {};

	const lifecycle: Prisma.UserWhereInput =
		filters.lifecycle === UserLifecycle.SUSPENDED
			? { status: UserStatus.SUSPENDED }
			: filters.lifecycle === UserLifecycle.ACTIVE
				? { status: UserStatus.ACTIVE, firstLoginAt: { not: null } }
				: filters.lifecycle === UserLifecycle.INVITED
					? { status: UserStatus.ACTIVE, firstLoginAt: null }
					: {};

	const users = await prisma.user.findMany({
		where: {
			deletedAt: null,
			...(filters.role ? { role: filters.role } : {}),
			...search,
			...lifecycle
		},
		include: teamUserInclude,
		orderBy: { createdAt: 'asc' }
	});

	return users
		.sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role])
		.map(toTeamUserResponse);
}

export async function getTeamUser(uuid: string) {
	return toTeamUserResponse(await findTeamUser(uuid));
}

export interface CreateUserInput {
	email: string;
	role: UserRole;
	designation?: string | null;
}

/**
 * Adds someone by email. A removed user with that email is restored (same
 * row, new role and designation) rather than duplicated.
 */
export async function addTeamUser(actor: CurrentUser, input: CreateUserInput) {
	const existing = await prisma.user.findUnique({
		where: { email: input.email }
	});

	if (existing && !existing.deletedAt) {
		throw HttpError.conflict('This email is already on the team.');
	}

	const fields = {
		role: input.role,
		designation: input.designation ?? null,
		updatedById: actor.id
	};

	const user = existing
		? await prisma.user.update({
				where: { id: existing.id },
				data: {
					...fields,
					status: UserStatus.ACTIVE,
					deletedAt: null,
					deletedById: null,
					suspendedAt: null,
					suspendedById: null
				},
				include: teamUserInclude
			})
		: await prisma.user.create({
				data: { ...fields, email: input.email, createdById: actor.id },
				include: teamUserInclude
			});

	return toTeamUserResponse(user);
}

export interface UpdateUserInput {
	role?: UserRole;
	designation?: string | null;
	showOnWebsite?: boolean;
	isFounder?: boolean;
	displayOrder?: number;
}

/**
 * Role, designation and website settings. Designation and website settings
 * may be set on anyone — your own included; a role change follows the
 * management guards.
 */
export async function updateTeamUser(
	actor: CurrentUser,
	uuid: string,
	input: UpdateUserInput
) {
	const target = await findTeamUser(uuid);
	if (input.role !== undefined && input.role !== target.role) {
		assertManageable(actor, target);
	}

	const user = await prisma.user.update({
		where: { id: target.id },
		data: { ...input, updatedById: actor.id },
		include: teamUserInclude
	});

	return toTeamUserResponse(user);
}

export async function suspendTeamUser(actor: CurrentUser, uuid: string) {
	const target = await findTeamUser(uuid);
	assertManageable(actor, target);
	if (target.status === UserStatus.SUSPENDED)
		return toTeamUserResponse(target);

	const user = await prisma.user.update({
		where: { id: target.id },
		data: {
			status: UserStatus.SUSPENDED,
			suspendedAt: new Date(),
			suspendedById: actor.id,
			updatedById: actor.id
		},
		include: teamUserInclude
	});

	return toTeamUserResponse(user);
}

export async function reactivateTeamUser(actor: CurrentUser, uuid: string) {
	const target = await findTeamUser(uuid);
	assertManageable(actor, target);
	if (target.status === UserStatus.ACTIVE) return toTeamUserResponse(target);

	const user = await prisma.user.update({
		where: { id: target.id },
		data: {
			status: UserStatus.ACTIVE,
			suspendedAt: null,
			suspendedById: null,
			updatedById: actor.id
		},
		include: teamUserInclude
	});

	return toTeamUserResponse(user);
}

/**
 * Soft-removes someone who has never signed in. Anyone who has may have
 * authored records, so they can only be suspended.
 */
export async function removeTeamUser(actor: CurrentUser, uuid: string) {
	const target = await findTeamUser(uuid);
	assertManageable(actor, target);
	if (target.firstLoginAt) {
		throw HttpError.conflict(
			'They have already signed in, so they can only be suspended.'
		);
	}

	await prisma.user.update({
		where: { id: target.id },
		data: {
			deletedAt: new Date(),
			deletedById: actor.id,
			updatedById: actor.id
		}
	});
}

/**
 * Replaces a Team Member's whole permission grid. Features left out lose all
 * access; every grant is normalised so Create/Edit/Delete imply View.
 */
export async function replaceTeamUserPermissions(
	actor: CurrentUser,
	uuid: string,
	grants: Partial<Record<Feature, FeatureGrant>>
) {
	const target = await findTeamUser(uuid);
	assertManageable(actor, target);
	if (target.role !== UserRole.TEAM_MEMBER) {
		throw HttpError.conflict(
			'Admins already have every permission — only Team Members get grants.'
		);
	}

	const none: FeatureGrant = {
		create: false,
		view: false,
		edit: false,
		delete: false
	};
	const features = Object.keys(permissionMap(target.role, [])) as Feature[];

	await prisma.$transaction([
		...features.map((feature) => {
			const grant = normaliseGrant(grants[feature] ?? none);
			const values = {
				canCreate: grant.create,
				canView: grant.view,
				canEdit: grant.edit,
				canDelete: grant.delete,
				updatedById: actor.id
			};

			return prisma.userPermission.upsert({
				where: { userId_feature: { userId: target.id, feature } },
				create: { ...values, userId: target.id, feature },
				update: values
			});
		}),
		prisma.user.update({
			where: { id: target.id },
			data: { updatedById: actor.id }
		})
	]);

	return getTeamUser(uuid);
}
