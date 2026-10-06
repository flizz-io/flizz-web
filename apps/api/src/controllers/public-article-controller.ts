import type { Request, Response } from 'express';

import {
	articleSlugParamSchema,
	listPublicArticlesQuerySchema
} from '../schemas/article-schema.js';
import {
	getArticleRedirect,
	getPublicArticle,
	listPublicArticles
} from '../services/public-article-service.js';
import { parseInput } from '../utils/parse-input.js';

const slugOf = (req: Request) =>
	parseInput(articleSlugParamSchema, req.params).slug;

/** GET /api/public/articles — `?category=&tag=&search=&sort=` */
export async function getPublicArticles(req: Request, res: Response) {
	const filters = parseInput(listPublicArticlesQuerySchema, req.query);
	res.json({ data: await listPublicArticles(filters) });
}

/** GET /api/public/articles/:slug — the detail page; 404 unless visible. */
export async function getPublicArticleBySlug(req: Request, res: Response) {
	res.json({ data: await getPublicArticle(slugOf(req)) });
}

/** GET /api/public/articles/redirects/:slug — where an old slug went. */
export async function getPublicArticleRedirect(req: Request, res: Response) {
	res.json({ data: await getArticleRedirect(slugOf(req)) });
}
