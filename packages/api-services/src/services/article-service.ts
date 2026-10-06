import { apiService, toUploadForm } from './api-service';
import { HttpMethod } from '../enums/api';
import type { ApiContext, ImageSizeOptions } from '../models/api';
import type {
	ArticleAuthorOption,
	ArticleListItem,
	ArticleListQuery,
	ArticleMedia,
	ArticleRecord,
	ArticleTag,
	CreateArticlePayload,
	PublicArticle,
	PublicArticleDetail,
	PublicArticleListQuery,
	UpdateArticlePayload
} from '../models/articles';
import type { ProjectImage } from '../models/projects';
import type { PublicSlugRedirect } from '../models/services';

const articlePath = (uuid: string) => `/articles/${encodeURIComponent(uuid)}`;

// Dashboard — need a session with the ARTICLES grant.

export function getArticlesService(
	query: ArticleListQuery = {},
	context?: ApiContext
) {
	return apiService<ArticleListItem[]>('/articles', {
		query: { ...query },
		context
	});
}

/** Tags already in use, most used first — the form's suggestions. */
export function getArticleTagsService(context?: ApiContext) {
	return apiService<ArticleTag[]>('/articles/tags', { context });
}

/** People shown on the website — the form's author dropdown. */
export function getArticleAuthorsService(context?: ApiContext) {
	return apiService<ArticleAuthorOption[]>('/articles/authors', { context });
}

export function getArticleService(uuid: string, context?: ApiContext) {
	return apiService<ArticleRecord>(articlePath(uuid), { context });
}

export function createArticleService(
	payload: CreateArticlePayload,
	context?: ApiContext
) {
	return apiService<ArticleRecord>('/articles', {
		method: HttpMethod.POST,
		body: payload,
		context
	});
}

export function updateArticleService(
	uuid: string,
	payload: UpdateArticlePayload,
	context?: ApiContext
) {
	return apiService<ArticleRecord>(articlePath(uuid), {
		method: HttpMethod.PATCH,
		body: payload,
		context
	});
}

/** Soft delete. */
export function deleteArticleService(uuid: string, context?: ApiContext) {
	return apiService<void>(articlePath(uuid), {
		method: HttpMethod.DELETE,
		context
	});
}

// Images — the cover and share image return both as they now stand.

export function uploadArticleCoverService(
	uuid: string,
	file: Blob,
	size: ImageSizeOptions = {},
	context?: ApiContext
) {
	return apiService<ArticleMedia>(`${articlePath(uuid)}/cover`, {
		method: HttpMethod.POST,
		form: toUploadForm(file, { ...size }),
		context
	});
}

export function clearArticleCoverService(uuid: string, context?: ApiContext) {
	return apiService<ArticleMedia>(`${articlePath(uuid)}/cover`, {
		method: HttpMethod.DELETE,
		context
	});
}

export function uploadArticleOgImageService(
	uuid: string,
	file: Blob,
	size: ImageSizeOptions = {},
	context?: ApiContext
) {
	return apiService<ArticleMedia>(`${articlePath(uuid)}/og-image`, {
		method: HttpMethod.POST,
		form: toUploadForm(file, { ...size }),
		context
	});
}

export function clearArticleOgImageService(uuid: string, context?: ApiContext) {
	return apiService<ArticleMedia>(`${articlePath(uuid)}/og-image`, {
		method: HttpMethod.DELETE,
		context
	});
}

/** A body image for an image block — save the body to keep it. */
export function uploadArticleBodyImageService(
	uuid: string,
	file: Blob,
	size: ImageSizeOptions = {},
	context?: ApiContext
) {
	return apiService<ProjectImage>(`${articlePath(uuid)}/images`, {
		method: HttpMethod.POST,
		form: toUploadForm(file, { ...size }),
		context
	});
}

// Public — the website; no session.

export function getPublicArticlesService(
	query: PublicArticleListQuery = {},
	context?: ApiContext
) {
	return apiService<PublicArticle[]>('/public/articles', {
		query: { ...query },
		context
	});
}

export function getPublicArticleService(slug: string, context?: ApiContext) {
	return apiService<PublicArticleDetail>(
		`/public/articles/${encodeURIComponent(slug)}`,
		{ context }
	);
}

/** Where an old slug went — 404 when it never redirected anywhere visible. */
export function getArticleRedirectService(slug: string, context?: ApiContext) {
	return apiService<PublicSlugRedirect>(
		`/public/articles/redirects/${encodeURIComponent(slug)}`,
		{ context }
	);
}
