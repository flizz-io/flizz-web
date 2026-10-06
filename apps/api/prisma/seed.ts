import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { imagePresets } from '@workspace/media-library';

import articleSeeds from './seed-data/articles.json' with { type: 'json' };
import projectSeeds from './seed-data/projects.json' with { type: 'json' };
import serviceSeeds from './seed-data/services.json' with { type: 'json' };
import testimonialSeeds from './seed-data/testimonials.json' with { type: 'json' };
import { prisma } from '../src/configs/database.js';
import { env } from '../src/configs/env.js';
import { storage } from '../src/configs/media.js';
import {
	ArticleCategory,
	MediaPurpose,
	ProjectSector,
	ProjectStatus,
	PublishStatus,
	ServiceCategory,
	UserRole,
	UserStatus
} from '../src/generated/prisma/enums.js';
import { articleBodySchema } from '../src/schemas/article-schema.js';
import { storeImage } from '../src/services/media-service.js';
import { displayName } from '../src/utils/user-display.js';

/** Seed files; `coverImagePath` in projects.json is relative to this. */
const SEED_DATA_DIR = path.resolve('prisma/seed-data');

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

/** A seeded cover screenshot, through the media library. */
async function seedCover(relativePath: string, authorId: number) {
	const file = path.join(SEED_DATA_DIR, relativePath);
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
 * seed data to the current provider and retires the old row.
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
 * The ten projects of the retired static roster (seed-data/projects.json,
 * screenshots in seed-data/projects/), Published with today's featured and
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

		// Services are seeded first; a project names its service by slug.
		const { id: serviceId } = await prisma.service.findUniqueOrThrow({
			where: { slug: seed.serviceSlug },
			select: { id: true }
		});
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
				serviceId,
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

/**
 * The twelve services of the static roster (seed-data/services.json, exported
 * from apps/web `constants/services.ts`), Published. Like projects, only
 * creates what's missing, so dashboard edits are never overwritten.
 */
async function seedServices(authorId: number) {
	let created = 0;

	for (const seed of serviceSeeds) {
		const existing = await prisma.service.findUnique({
			where: { slug: seed.slug }
		});
		if (existing) continue;

		await prisma.service.create({
			data: {
				...seed,
				category:
					ServiceCategory[
						seed.category as keyof typeof ServiceCategory
					],
				status: PublishStatus.PUBLISHED,
				createdById: authorId,
				updatedById: authorId
			}
		});
		created += 1;
	}

	console.info(
		`Services: ${created} created, ${serviceSeeds.length - created} already there`
	);
}

/**
 * The three placeholder quotes of the retired static list
 * (seed-data/testimonials.json, from apps/web `constants/home.ts`),
 * Published, after any already there. A quote that exists — even deleted —
 * is skipped, so dashboard edits stay and a deleted placeholder stays gone.
 */
async function seedTestimonials(authorId: number) {
	let created = 0;

	for (const seed of testimonialSeeds) {
		const existing = await prisma.testimonial.findFirst({
			where: { quote: seed.quote }
		});
		if (existing) continue;

		const last = await prisma.testimonial.aggregate({
			where: { deletedAt: null },
			_max: { displayOrder: true }
		});
		await prisma.testimonial.create({
			data: {
				...seed,
				displayOrder: (last._max.displayOrder ?? -1) + 1,
				status: PublishStatus.PUBLISHED,
				createdById: authorId,
				updatedById: authorId
			}
		});
		created += 1;
	}

	console.info(
		`Testimonials: ${created} created, ${testimonialSeeds.length - created} already there`
	);
}

/**
 * The six placeholder articles of the retired static roster
 * (seed-data/articles.json, from apps/web `constants/articles.ts`), Published
 * with their original dates. The author is matched by name against the people
 * shown on the website; no match → the company byline. Only creates slugs that
 * don't exist yet — even deleted — so dashboard edits are never overwritten.
 */
async function seedArticles(createdById: number) {
	const authors = await prisma.user.findMany({
		where: {
			showOnWebsite: true,
			status: UserStatus.ACTIVE,
			deletedAt: null
		},
		select: {
			id: true,
			uuid: true,
			email: true,
			firstName: true,
			lastName: true
		}
	});
	const authorIdByName = new Map(
		authors.map((user) => [displayName(user).toLowerCase(), user.id])
	);
	let created = 0;

	for (const { authorName, publishAt, ...seed } of articleSeeds) {
		const existing = await prisma.article.findUnique({
			where: { slug: seed.slug }
		});
		if (existing) continue;

		const publishedAt = new Date(publishAt);
		await prisma.article.create({
			data: {
				...seed,
				category:
					ArticleCategory[
						seed.category as keyof typeof ArticleCategory
					],
				// Validated like any save, so a bad seed fails here, not on the site.
				body: articleBodySchema.parse(seed.body),
				authorId: authorIdByName.get(authorName.toLowerCase()) ?? null,
				status: PublishStatus.PUBLISHED,
				publishAt: publishedAt,
				firstPublishedAt: publishedAt,
				createdById,
				updatedById: createdById
			}
		});
		created += 1;
	}

	console.info(
		`Articles: ${created} created, ${articleSeeds.length - created} already there`
	);
}

try {
	const superAdmin = await seedSuperAdmin();
	await seedServices(superAdmin.id);
	await seedProjects(superAdmin.id);
	await seedTestimonials(superAdmin.id);
	await seedArticles(superAdmin.id);
} finally {
	await prisma.$disconnect();
}
