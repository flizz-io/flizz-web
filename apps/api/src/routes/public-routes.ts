import { Router } from 'express';

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

/** Read-only endpoints the public site calls — no session. */
export const publicRouter = Router();

publicRouter.get('/team', getPublicTeam);
publicRouter.get('/projects', getPublicProjects);
// Before `/:slug` — `home` is a reserved slug for this reason.
publicRouter.get('/projects/home', getHomeProjects);
publicRouter.get('/projects/:slug', getPublicProjectBySlug);
publicRouter.get('/services', getPublicServices);
publicRouter.get('/services/redirects/:slug', getPublicServiceRedirect);
publicRouter.get('/services/:slug', getPublicServiceBySlug);
