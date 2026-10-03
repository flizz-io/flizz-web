import { z } from 'zod';

import { slugSchema } from './slug-schema.js';
import { serviceLimits, serviceVisualKinds } from '../constants/service.js';
import { PublishStatus, ServiceCategory } from '../generated/prisma/enums.js';

const limits = serviceLimits;

const text = (max: number) => z.string().trim().min(1).max(max);

/** Optional text — blank or `null` clears it. */
const optionalText = (max: number) =>
	z
		.string()
		.trim()
		.max(max)
		.nullable()
		.transform((value) => value || null);

const list = (min: number, max: number) =>
	z.array(text(limits.listItem)).min(min).max(max);

export const serviceFaqSchema = z.object({
	question: text(limits.faqQuestion),
	answer: text(limits.faqAnswer)
});

export const serviceUuidSchema = z.object({ uuid: z.uuid() });

export const serviceSlugParamSchema = z.object({ slug: slugSchema });

export const listServicesQuerySchema = z.object({
	search: z.string().trim().max(120).optional(),
	category: z.enum(ServiceCategory).optional(),
	status: z.enum(PublishStatus).optional()
});

/** Everything the pages say — required on create. */
const contentSchema = z.object({
	title: text(limits.title),
	category: z.enum(ServiceCategory),
	summary: text(limits.summary),
	visualKind: z.enum(serviceVisualKinds),
	intro: text(limits.intro),
	problem: text(limits.problem),
	deliverables: list(limits.deliverablesMin, limits.deliverablesMax),
	outcomes: list(limits.outcomesMin, limits.outcomesMax),
	engagement: optionalText(limits.engagement),
	faqs: z.array(serviceFaqSchema).max(limits.faqsMax),
	seoTitle: optionalText(limits.seoTitle),
	seoDescription: optionalText(limits.seoDescription)
});

/** A new service always starts as a Draft, last in its category. */
export const createServiceSchema = contentSchema.extend({
	slug: slugSchema.optional(),
	engagement: contentSchema.shape.engagement.optional(),
	faqs: contentSchema.shape.faqs.optional(),
	seoTitle: contentSchema.shape.seoTitle.optional(),
	seoDescription: contentSchema.shape.seoDescription.optional()
});

export const updateServiceSchema = contentSchema
	.extend({ slug: slugSchema, status: z.enum(PublishStatus) })
	.partial()
	.refine((body) => Object.keys(body).length > 0, {
		message: 'Nothing to update.'
	});

/** The whole category, in its new order — every live service once. */
export const reorderServicesSchema = z.object({
	category: z.enum(ServiceCategory),
	serviceUuids: z.array(z.uuid()).min(1)
});

export type ServiceFaq = z.infer<typeof serviceFaqSchema>;
export type ListServicesFilters = z.infer<typeof listServicesQuerySchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ReorderServicesInput = z.infer<typeof reorderServicesSchema>;
