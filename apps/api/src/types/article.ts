import type { ImageResponse } from './project.js';

/** A body image as the editor gets it back from an upload. */
export type ArticleBodyImageResponse = ImageResponse;

/** An article's cover and share image, as the media endpoints return them. */
export interface ArticleMediaResponse {
	cover: ImageResponse | null;
	ogImage: ImageResponse | null;
}
