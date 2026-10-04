import { prisma } from '../configs/database.js';
import type { Prisma } from '../generated/prisma/client.js';
import type { SlugEntityType } from '../generated/prisma/enums.js';
import type { CurrentUser } from '../types/user.js';

/**
 * Old slugs that 301 to a record's current one — see
 * docs/requirements/services-crud.md#slug-redirects. Shared by every
 * slug-addressed entity; each passes its own `SlugEntityType`.
 */

/** The record an old slug belongs to, if it still redirects. */
export async function findRedirectTarget(
	entityType: SlugEntityType,
	oldSlug: string
) {
	const redirect = await prisma.slugRedirect.findFirst({
		where: { entityType, oldSlug, deletedAt: null },
		select: { entityId: true }
	});

	return redirect?.entityId ?? null;
}

/** Whether a slug redirects to some *other* record of this type. */
export async function isRedirectSlug(
	entityType: SlugEntityType,
	slug: string,
	exceptEntityId?: number
) {
	const target = await findRedirectTarget(entityType, slug);

	return target !== null && target !== exceptEntityId;
}

/**
 * After a rename `from` → `to`: `from` redirects to the record, and if the
 * record is taking back an old slug, that slug's redirect retires.
 */
export async function recordSlugChange(
	tx: Prisma.TransactionClient,
	actor: CurrentUser,
	entityType: SlugEntityType,
	entityId: number,
	from: string,
	to: string
) {
	const now = new Date();

	await tx.slugRedirect.updateMany({
		where: { entityType, oldSlug: to, deletedAt: null },
		data: { deletedAt: now, deletedById: actor.id, updatedById: actor.id }
	});
	await tx.slugRedirect.upsert({
		where: { entityType_oldSlug: { entityType, oldSlug: from } },
		create: {
			entityType,
			oldSlug: from,
			entityId,
			createdById: actor.id,
			updatedById: actor.id
		},
		update: {
			entityId,
			deletedAt: null,
			deletedById: null,
			updatedById: actor.id
		}
	});
}
