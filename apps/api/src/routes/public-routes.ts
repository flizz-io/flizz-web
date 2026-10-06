import { Router } from 'express';

import { postContactMessage } from '../controllers/public-contact-controller.js';
import {
	getHomeProjects,
	getPublicProjectBySlug,
	getPublicProjects
} from '../controllers/public-project-controller.js';
import {
	getPublicServiceBySlug,
	getPublicServiceRedirect,
	getPublicServices
} from '../controllers/public-service-controller.js';
import { getPublicTeam } from '../controllers/public-team-controller.js';
import { getPublicTestimonials } from '../controllers/public-testimonial-controller.js';
import { publicFormLimiter } from '../middlewares/rate-limit.js';

/** Endpoints the public site calls — no session. All read-only but the form. */
export const publicRouter = Router();

publicRouter.get('/team', getPublicTeam);
publicRouter.get('/projects', getPublicProjects);
// Before `/:slug` — `home` is a reserved slug for this reason.
publicRouter.get('/projects/home', getHomeProjects);
publicRouter.get('/projects/:slug', getPublicProjectBySlug);
publicRouter.get('/services', getPublicServices);
publicRouter.get('/services/redirects/:slug', getPublicServiceRedirect);
publicRouter.get('/services/:slug', getPublicServiceBySlug);
publicRouter.get('/testimonials', getPublicTestimonials);
publicRouter.post('/contact', publicFormLimiter, postContactMessage);
