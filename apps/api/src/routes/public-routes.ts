import { Router } from 'express';

import {
	getHomeProjects,
	getPublicProjectBySlug,
	getPublicProjects
} from '../controllers/public-project-controller.js';
import { getPublicTeam } from '../controllers/public-team-controller.js';

/** Read-only endpoints the public site calls — no session. */
export const publicRouter = Router();

publicRouter.get('/team', getPublicTeam);
publicRouter.get('/projects', getPublicProjects);
// Before `/:slug` — `home` is a reserved slug for this reason.
publicRouter.get('/projects/home', getHomeProjects);
publicRouter.get('/projects/:slug', getPublicProjectBySlug);
