/**
 * Placeholder engagement data. Every figure here is static until the API lands
 * at Stage 10 — see `articleEngagement` in `constants/articles.ts`.
 */
export interface ArticleEngagement {
	/** Total views. Rendered abbreviated above a thousand. */
	views: number;
	reactions: number;
	commentCount: number;
}

export interface ArticleComment {
	id: string;
	author: string;
	/** Shown under the name. Free text — commenters are not staff. */
	role?: string;
	/** ISO date. */
	postedAt: string;
	body: string;
	/** One level of nesting only; a thread is a conversation, not a tree. */
	replies?: ArticleComment[];
}

/** Which engagement affordances an article page renders. */
export interface ArticleEngagementOptions {
	views?: boolean;
	reactions?: boolean;
	share?: boolean;
	comments?: boolean;
}
