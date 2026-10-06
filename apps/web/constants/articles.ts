import { ArticleByline } from '@/enums/articles';
import type {
	ArticleComment,
	ArticleEngagement,
	ArticleEngagementOptions
} from '@/types/engagement';

/**
 * Which attribution the article pages render. Both `AUTHOR` and `COMPANY` are
 * built — change this one value to compare them.
 *
 * TODO: PM to choose. The author comes from the dashboard (a person shown on
 * the About page); an article without one always gets the company byline.
 */
export const articleByline = ArticleByline.AUTHOR;

export const articlesHeroLead =
	'Notes on building software that has to keep working — what we argue about, what we got wrong, and the decisions that turned out to matter.';

export const articlesCtaHeading = 'Rather talk than read?';
export const articlesCtaLead =
	'Everything here comes out of real projects. If one of these sounds like your situation, a discovery call is faster than another article.';

/**
 * Which engagement affordances the article pages render. Each is designed but
 * not yet wired — nothing below persists, reacts, or counts anything.
 *
 * TODO: engagement stays static (deferred 2026-10-03, see articles-crud.md).
 * When it's built, remove the figures in `articleEngagement` and the sample
 * thread in `articleComments`.
 */
export const articleEngagementOptions: ArticleEngagementOptions = {
	views: true,
	reactions: true,
	share: true,
	comments: true
};

/** TODO: placeholder figures. Replace with real counts from the API. */
export const articleEngagement: ArticleEngagement = {
	views: 2847,
	reactions: 63,
	commentCount: 3
};

/** TODO: placeholder thread, shown so the design can be judged before the API. */
export const articleComments: ArticleComment[] = [
	{
		id: 'c1',
		author: 'Priya Raman',
		role: 'Engineering lead, Northwind',
		postedAt: '2026-08-20',
		body: 'The deprecation-window point lands. We published a date for the first time last quarter and it changed the conversation with partners completely — it stopped being a threat and started being a plan.',
		replies: [
			{
				id: 'c1r1',
				author: 'Zahid Showarav',
				role: 'Co-founder, Principal Engineer',
				postedAt: '2026-08-20',
				body: 'That matches what we see. The date is the whole thing — without one, everybody assumes they are the exception.'
			}
		]
	},
	{
		id: 'c2',
		author: 'Tom Ashworth',
		postedAt: '2026-08-19',
		body: 'Curious how you handle the case where a consumer never migrates and the deprecation date arrives. Do you actually switch it off?'
	}
];
