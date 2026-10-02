import { Router } from 'express';

import { getPublicTeam } from '../controllers/public-team-controller.js';

/** Read-only endpoints the public site calls — no session. */
export const publicRouter = Router();

publicRouter.get('/team', getPublicTeam);
