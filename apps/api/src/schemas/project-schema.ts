import { z } from 'zod';

import { slugSchema } from './slug-schema.js';
import { projectLimits } from '../constants/project.js';
import { ProjectVisibility } from '../enums/project-visibility.js';
import { ProjectSector, ProjectStatus } from '../generated/prisma/enums.js';

const limits = projectLimits;

const text = (max: number) => z.string().trim().min(1).max(max);

const slug = slugSchema;

const storyList = z
	.array(text(limits.storyItem))
	.min(limits.storyItemsMin)
	.max(limits.storyItemsMax);

const displayOrder = z.number().int().min(0).max(limits.displayOrderMax);

export const projectResultSchema = z.object({
	label: text(limits.resultField),
	from: text(limits.resultField),
	to: text(limits.resultField)
});

/** Both parts or neither — `null` removes the quote. */
const quote = z
	.object({
		text: text(limits.quoteText),
		attribution: text(limits.quoteAttribution)
	})
	.nullable();

/** ISO date-time with an offset; `null` (or blank) clears it. */
const publishAt = z
	.union([z.iso.datetime({ offset: true }), z.literal('')])
	.nullable()
	.transform((value) => (value ? new Date(value) : null));

export const projectUuidSchema = z.object({ uuid: z.uuid() });

export const projectSlugParamSchema = z.object({ slug });

export const listProjectsQuerySchema = z.object({
	search: z.string().trim().max(120).optional(),
	sector: z.enum(ProjectSector).optional(),
	visibility: z.enum(ProjectVisibility).optional()
});

/** Everything the case study says — required on create. */
const contentSchema = z.object({
	name: text(limits.name),
	client: text(limits.client),
	sector: z.enum(ProjectSector),
	/** The service it's evidence for — its category and page come from it. */
	serviceUuid: z.uuid(),
	year: z
		.number()
		.int()
		.min(limits.firstYear)
		.refine((year) => year <= new Date().getFullYear() + 1, {
			message: 'The year can be at most next year.'
		}),
	summary: text(limits.summary),
	results: z
		.array(projectResultSchema)
		.min(limits.resultsMin)
		.max(limits.resultsMax),
	duration: text(limits.duration),
	team: text(limits.team),
	brief: storyList,
	constraints: storyList,
	approach: storyList,
	built: storyList,
	stack: z.array(text(limits.stackChip)).max(limits.stackMax),
	quote
});

/** Publishing and placement — the Publishing section of the form. */
const placementSchema = z.object({
	status: z.enum(ProjectStatus),
	publishAt,
	featured: z.boolean(),
	featuredOrder: displayOrder,
	showOnHome: z.boolean(),
	homeOrder: displayOrder
});

/** A new project always starts as a Draft; the slug defaults to the name's. */
export const createProjectSchema = contentSchema.extend({
	slug: slug.optional(),
	quote: quote.optional(),
	stack: contentSchema.shape.stack.optional(),
	...placementSchema.omit({ status: true }).partial().shape
});

export const updateProjectSchema = contentSchema
	.extend({ slug, ...placementSchema.shape })
	.partial()
	.refine((body) => Object.keys(body).length > 0, {
		message: 'Nothing to update.'
	});

export type ListProjectsFilters = z.infer<typeof listProjectsQuerySchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
