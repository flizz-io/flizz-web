import type { Request, Response } from 'express';

import { listPublicTeam } from '../services/public-team-service.js';

/** GET /api/public/team — the About page team section. */
export async function getPublicTeam(_req: Request, res: Response) {
	res.json({ data: await listPublicTeam() });
}
