import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { imagePresets } from '@workspace/media-library';

import projectSeeds from './seed-data/projects.json' with { type: 'json' };
import { prisma } from '../src/configs/database.js';
import { env } from '../src/configs/env.js';
import { storage } from '../src/configs/media.js';
import {
	MediaPurpose,
	ProjectSector,
	ProjectStatus,
	ServiceCategory,
	UserRole,
	UserStatus
} from '../src/generated/prisma/enums.js';
import { storeImage } from '../src/services/media-service.js';

/** Where the static roster's screenshots live (apps/web/public). */
const WEB_PUBLIC_DIR = path.resolve('../web/public');

/**
 * Makes `SUPER_ADMIN_EMAIL` the one Super Admin. Safe to re-run. A previous
 * Super Admin (the env changed) is demoted to Admin, never removed; a
 * matching user who was suspended or removed is restored, since the env is
 * the final word on who owns the dashboard.
 */
async function seedSuperAdmin() {
	const email = env.superAdminEmail;

	const superAdmin = await prisma.$transaction(async (tx) => {
		await tx.user.updateMany({
			where: { role: UserRole.SUPER_ADMIN, email: { not: email } },
			data: { role: UserRole.ADMIN }
		});

		return tx.user.upsert({
			where: { email },
			create: { email, role: UserRole.SUPER_ADMIN },
			update: {
				role: UserRole.SUPER_ADMIN,
				status: UserStatus.ACTIVE,
				suspendedAt: null,
				suspendedById: null,
				deletedAt: null,
				deletedById: null
			}
		});
	});

	console.info(`Super Admin: ${email}`);
	return superAdmin;
}

/** A cover screenshot from the web app's public folder, through the media library. */
async function seedCover(relativePath: string, authorId: number) {
	const file = path.join(WEB_PUBLIC_DIR, relativePath);
	const image = await storeImage({
		buffer: await readFile(file),
		originalName: path.basename(file),
		purpose: MediaPurpose.PROJECT_COVER,
		preset: imagePresets.projectCover
	});

	return prisma.mediaFile.create({
		data: {
			...image,
			provider: storage.name,
			createdById: authorId,
			updatedById: authorId
		}
	});
}

type SeedProject = (typeof projectSeeds)[number];

/**
 * After `MEDIA_PROVIDER` changes (local → Cloudinary), a seeded cover still
 * points at the old provider and its URL would break. Re-uploads it from the
 * web app's public folder to the current provider and retires the old row.
 * Only touches a cover that is still the seeded one on another provider — a
 * cover an admin replaced in the dashboard is left alone.
 */
async function moveCoverToCurrentProvider(
	project: {
		id: number;
		coverImage: {
			id: number;
			provider: string;
			originalName: string | null;
		} | null;
	},
	seed: SeedProject,
	authorId: number
) {
	const cover = project.coverImage;
	if (!cover || !seed.coverImagePath) return false;
	if (cover.provider === storage.name) return false;
	if (cover.originalName !== path.basename(seed.coverImagePath)) return false;

	const fresh = await seedCover(seed.coverImagePath, authorId);
	await prisma.$transaction([
		prisma.project.update({
			where: { id: project.id },
			data: { coverImageId: fresh.id, updatedById: authorId }
		}),
		prisma.mediaFile.update({
			where: { id: cover.id },
			data: {
				deletedAt: new Date(),
				deletedById: authorId,
				updatedById: authorId
			}
		})
	]);

	return true;
}

/**
 * The ten projects from the static roster (apps/web/constants/portfolio.ts,
 * exported to seed-data/projects.json), Published with today's featured and
 * home-strip choices — so the site looks the same when it switches to the API.
 * Only creates what's missing: a slug that exists (even deleted) is left
 * alone, so re-running never overwrites dashboard edits — except to move a
 * seeded cover onto the current storage provider (see above).
 */
async function seedProjects(authorId: number) {
	let created = 0;
	let moved = 0;

	for (const seed of projectSeeds) {
		const existing = await prisma.project.findUnique({
			where: { slug: seed.slug },
			include: { coverImage: true }
		});
		if (existing) {
			if (await moveCoverToCurrentProvider(existing, seed, authorId)) {
				moved += 1;
			}
			continue;
		}

		const cover = seed.coverImagePath
			? await seedCover(seed.coverImagePath, authorId)
			: null;
		const now = new Date();

		await prisma.project.create({
			data: {
				slug: seed.slug,
				name: seed.name,
				client: seed.client,
				sector: ProjectSector[
					seed.sector as keyof typeof ProjectSector
				],
				serviceCategory:
					ServiceCategory[
						seed.serviceCategory as keyof typeof ServiceCategory
					],
				serviceSlug: seed.serviceSlug,
				year: seed.year,
				summary: seed.summary,
				results: seed.results,
				duration: seed.duration,
				team: seed.team,
				brief: seed.brief,
				constraints: seed.constraints,
				approach: seed.approach,
				built: seed.built,
				stack: seed.stack,
				quoteText: seed.quote?.text ?? null,
				quoteAttribution: seed.quote?.attribution ?? null,
				coverImageId: cover?.id ?? null,
				status: ProjectStatus.PUBLISHED,
				firstPublishedAt: now,
				featured: seed.featured,
				featuredOrder: seed.featuredOrder,
				showOnHome: seed.showOnHome,
				homeOrder: seed.homeOrder,
				createdById: authorId,
				updatedById: authorId
			}
		});
		created += 1;
	}

	console.info(
		`Projects: ${created} created, ${projectSeeds.length - created} already there, ${moved} cover(s) moved to ${storage.name}`
	);
}

try {
	const superAdmin = await seedSuperAdmin();
	await seedProjects(superAdmin.id);
} finally {
	await prisma.$disconnect();
}
