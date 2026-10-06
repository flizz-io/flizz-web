import type { Request, Response } from 'express';

import { listPublicTestimonials } from '../services/public-testimonial-service.js';

/** GET /api/public/testimonials — the home page section. */
export async function getPublicTestimonials(_req: Request, res: Response) {
	res.json({ data: await listPublicTestimonials() });
}
