import { z } from 'zod';

import { UserLifecycle } from '../enums/user-lifecycle.js';
import { Feature, UserRole } from '../generated/prisma/enums.js';

const DESIGNATION_MAX = 120;

/** Roles an admin can give. Super Admin comes only from the env + seed. */
const assignableRole = z.enum([UserRole.ADMIN, UserRole.TEAM_MEMBER]);

/** Blank clears the field. */
const optionalText = (max: number) =>
	z
		.string()
		.trim()
		.max(max)
		.transform((value) => value || null)
		.nullable();

export const userUuidParamSchema = z.object({ uuid: z.uuid() });

export const listUsersQuerySchema = z.object({
	search: z.string().trim().max(120).optional(),
	role: z.enum(UserRole).optional(),
	lifecycle: z.enum(UserLifecycle).optional()
});

export const createUserSchema = z.object({
	email: z
		.email()
		.trim()
		.transform((email) => email.toLowerCase()),
	role: assignableRole,
	designation: optionalText(DESIGNATION_MAX).optional()
});

export const updateUserSchema = z
	.object({
		role: assignableRole,
		designation: optionalText(DESIGNATION_MAX),
		showOnWebsite: z.boolean(),
		isFounder: z.boolean(),
		displayOrder: z.number().int().min(0).max(10_000)
	})
	.partial()
	.refine((body) => Object.keys(body).length > 0, {
		message: 'Nothing to update.'
	});

const grantSchema = z.object({
	create: z.boolean(),
	view: z.boolean(),
	edit: z.boolean(),
	delete: z.boolean()
});

/** The whole grid; features left out end up with no access. */
export const replacePermissionsSchema = z.object({
	permissions: z.partialRecord(z.enum(Feature), grantSchema)
});
