import type { Request, Response } from 'express';

import {
	articleUuidSchema,
	createArticleSchema,
	listArticlesQuerySchema,
	updateArticleSchema
} from '../schemas/article-schema.js';
import {
	addArticle,
	editArticle,
	getDashboardArticle,
	listArticleAuthors,
	listArticleTags,
	listDashboardArticles,
	removeArticle
} from '../services/article-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { parseInput } from '../utils/parse-input.js';

const uuidOf = (req: Request) => parseInput(articleUuidSchema, req.params).uuid;

/** GET /api/articles — `?search=&category=&visibility=` */
export async function listArticles(req: Request, res: Response) {
	const filters = parseInput(listArticlesQuerySchema, req.query);
	res.json({ data: await listDashboardArticles(filters) });
}

/** GET /api/articles/tags — the form's tag suggestions. */
export async function getArticleTags(_req: Request, res: Response) {
	res.json({ data: await listArticleTags() });
}

/** GET /api/articles/authors — the form's author dropdown. */
export async function getArticleAuthors(_req: Request, res: Response) {
	res.json({ data: await listArticleAuthors() });
}

/** GET /api/articles/:uuid */
export async function getArticle(req: Request, res: Response) {
	res.json({ data: await getDashboardArticle(uuidOf(req)) });
}

/** POST /api/articles — always a Draft. */
export async function createArticle(req: Request, res: Response) {
	const input = parseInput(createArticleSchema, req.body);
	res.status(201).json({ data: await addArticle(currentUserOf(res), input) });
}

/** PATCH /api/articles/:uuid */
export async function updateArticle(req: Request, res: Response) {
	const input = parseInput(updateArticleSchema, req.body);
	res.json({
		data: await editArticle(currentUserOf(res), uuidOf(req), input)
	});
}

/** DELETE /api/articles/:uuid — soft. */
export async function deleteArticle(req: Request, res: Response) {
	await removeArticle(currentUserOf(res), uuidOf(req));
	res.status(204).end();
}
