import type { ArticleCategory, PublishStatus } from '@workspace/api-services';
import type { EditorBlock } from '@workspace/text-editor';

/** Everything the article form edits, as the inputs hold it. */
export interface ArticleFormValues {
	title: string;
	slug: string;
	excerpt: string;
	category: ArticleCategory;
	tags: string[];
	/** '' → no author (the company byline). */
	authorUuid: string;
	body: EditorBlock[];
	seoTitle: string;
	seoDescription: string;
	noindex: boolean;
	status: PublishStatus;
	/** ISO, or '' for none. */
	publishAt: string;
}

/** Updates one field of the form. */
export type SetArticleField = <K extends keyof ArticleFormValues>(
	field: K,
	value: ArticleFormValues[K]
) => void;

/** Props every form section takes. */
export interface ArticleSectionProps {
	values: ArticleFormValues;
	setField: SetArticleField;
	/** API messages keyed by field path — `title`, `body.3.alt`. */
	errors: Record<string, string>;
}
