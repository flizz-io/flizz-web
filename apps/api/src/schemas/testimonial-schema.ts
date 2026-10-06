import { z } from 'zod';

import { testimonialLimits } from '../constants/testimonial.js';
import { PublishStatus } from '../generated/prisma/enums.js';

const limits = testimonialLimits;

const text = (max: number) => z.string().trim().min(1).max(max);

/** One line — the section sets the quote large, without breaks. */
const quoteSchema = text(limits.quote).refine(
	(quote) => !/[\r\n]/.test(quote),
	{ message: 'Keep the quote on one line.' }
);

const highlightsSchema = z
	.array(text(limits.highlight))
	.max(limits.highlightsMax)
	.refine(
		(phrases) =>
			new Set(phrases.map((phrase) => phrase.toLowerCase())).size ===
			phrases.length,
		{ message: 'Each highlight can be picked once.' }
	);

export const testimonialUuidSchema = z.object({ uuid: z.uuid() });

export const listTestimonialsQuerySchema = z.object({
	search: z.string().trim().max(120).optional(),
	status: z.enum(PublishStatus).optional()
});

const contentSchema = z.object({
	quote: quoteSchema,
	highlights: highlightsSchema,
	authorName: text(limits.authorName),
	authorRole: text(limits.authorRole),
	/** `null` unlinks. */
	projectUuid: z.uuid().nullable()
});

/** A new testimonial always starts as a Draft, last in the list. */
export const createTestimonialSchema = contentSchema.extend({
	highlights: highlightsSchema.optional(),
	projectUuid: contentSchema.shape.projectUuid.optional()
});

export const updateTestimonialSchema = contentSchema
	.extend({ status: z.enum(PublishStatus) })
	.partial()
	.refine((body) => Object.keys(body).length > 0, {
		message: 'Nothing to update.'
	});

/** The whole list, in its new order — every live testimonial once. */
export const reorderTestimonialsSchema = z.object({
	testimonialUuids: z.array(z.uuid()).min(1)
});

export type ListTestimonialsFilters = z.infer<
	typeof listTestimonialsQuerySchema
>;
export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type ReorderTestimonialsInput = z.infer<
	typeof reorderTestimonialsSchema
>;
