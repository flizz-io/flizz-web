import type { Request, Response } from 'express';

import {
	createTestimonialSchema,
	listTestimonialsQuerySchema,
	reorderTestimonialsSchema,
	testimonialUuidSchema,
	updateTestimonialSchema
} from '../schemas/testimonial-schema.js';
import {
	addTestimonial,
	editTestimonial,
	getDashboardTestimonial,
	listDashboardTestimonials,
	listTestimonialProjectOptions,
	removeTestimonial,
	reorderTestimonials
} from '../services/testimonial-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { parseInput } from '../utils/parse-input.js';

const uuidOf = (req: Request) =>
	parseInput(testimonialUuidSchema, req.params).uuid;

/** GET /api/testimonials — `?search=&status=` */
export async function listTestimonials(req: Request, res: Response) {
	const filters = parseInput(listTestimonialsQuerySchema, req.query);
	res.json({ data: await listDashboardTestimonials(filters) });
}

/** GET /api/testimonials/project-options — the form's Project dropdown. */
export async function getTestimonialProjectOptions(
	_req: Request,
	res: Response
) {
	res.json({ data: await listTestimonialProjectOptions() });
}

/** GET /api/testimonials/:uuid */
export async function getTestimonial(req: Request, res: Response) {
	res.json({ data: await getDashboardTestimonial(uuidOf(req)) });
}

/** POST /api/testimonials — always a Draft, last in the list. */
export async function createTestimonial(req: Request, res: Response) {
	const input = parseInput(createTestimonialSchema, req.body);
	res.status(201).json({
		data: await addTestimonial(currentUserOf(res), input)
	});
}

/** PATCH /api/testimonials/:uuid */
export async function updateTestimonial(req: Request, res: Response) {
	const input = parseInput(updateTestimonialSchema, req.body);
	res.json({
		data: await editTestimonial(currentUserOf(res), uuidOf(req), input)
	});
}

/** DELETE /api/testimonials/:uuid — soft. */
export async function deleteTestimonial(req: Request, res: Response) {
	await removeTestimonial(currentUserOf(res), uuidOf(req));
	res.status(204).end();
}

/** PUT /api/testimonials/order — `{ testimonialUuids: [...] }` */
export async function reorderTestimonialList(req: Request, res: Response) {
	const input = parseInput(reorderTestimonialsSchema, req.body);
	res.json({ data: await reorderTestimonials(currentUserOf(res), input) });
}
