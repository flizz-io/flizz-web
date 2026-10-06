import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { ArticleBody } from '@/components/features/articles/article-body';
import { ArticleBylineCard } from '@/components/features/articles/article-byline';
import { ArticleComments } from '@/components/features/articles/article-comments';
import { ArticleDetailHero } from '@/components/features/articles/article-detail-hero';
import { ArticleEngagementBar } from '@/components/features/articles/article-engagement';
import { ArticleRelated } from '@/components/features/articles/article-related';
import { ArticlesCta } from '@/components/features/articles/articles-cta';
import { ArticleReadDepth } from '@/components/snippets/analytics/article-read-depth';
import { TrackContentView } from '@/components/snippets/analytics/track-content-view';
import { siteConfig } from '@/configs/site';
import {
	articleByline,
	articleComments,
	articleEngagement,
	articleEngagementOptions
} from '@/constants/articles';
import { ContentType } from '@/enums/analytics';
import { RoutePath } from '@/enums/routes';
import { OgType } from '@/enums/seo';
import type { ArticleDetail } from '@/types/articles';
import {
	getArticleRedirect,
	getPublishedArticle,
	getPublishedArticles
} from '@/utils/articles-api';
import { buildPageMetadata } from '@/utils/metadata';

interface ArticlePageProps {
	params: Promise<{ slug: string }>;
}

/**
 * Every published article is built ahead; one published later renders on its
 * first visit and is cached from then on (`dynamicParams` stays on).
 */
export async function generateStaticParams() {
	return (await getPublishedArticles()).map((article) => ({
		slug: article.slug
	}));
}

const aboutUrl = `${siteConfig.url}${RoutePath.ABOUT}`;

export async function generateMetadata({
	params
}: ArticlePageProps): Promise<Metadata> {
	const { slug } = await params;
	const article = await getPublishedArticle(slug);

	if (!article) return {};

	return {
		...buildPageMetadata({
			title: article.seoTitle ?? article.title,
			description: article.seoDescription ?? article.excerpt,
			path: `${RoutePath.ARTICLES}/${article.slug}`,
			type: OgType.ARTICLE,
			noindex: article.noindex,
			keywords: [article.category, ...article.tags],
			article: {
				publishedTime: article.publishedAt,
				modifiedTime: article.updatedAt,
				// A profile URL, as `article:author` expects, when someone is named.
				authors: article.author ? [aboutUrl] : [siteConfig.url],
				section: article.category,
				tags: article.tags
			}
		}),
		authors: [
			article.author
				? { name: article.author.name, url: aboutUrl }
				: { name: siteConfig.name, url: siteConfig.url }
		]
	};
}

/** The byline as structured data — a person with their profiles, or the company. */
function authorSchema(article: ArticleDetail) {
	if (!article.author) {
		return {
			'@type': 'Organization',
			name: siteConfig.name,
			url: siteConfig.url
		};
	}
	const sameAs = Object.values(article.author.links).filter(Boolean);

	return {
		'@type': 'Person',
		name: article.author.name,
		...(article.author.role ? { jobTitle: article.author.role } : {}),
		url: aboutUrl,
		...(sameAs.length ? { sameAs } : {})
	};
}

export default async function ArticlePage({ params }: ArticlePageProps) {
	const { slug } = await params;
	const [article, articles] = await Promise.all([
		getPublishedArticle(slug),
		getPublishedArticles()
	]);

	if (!article) {
		// An old slug of a renamed article answers with a 308 to the new one.
		const current = await getArticleRedirect(slug);
		if (current) permanentRedirect(`${RoutePath.ARTICLES}/${current}`);
		notFound();
	}

	const related = articles.filter(
		(entry) =>
			entry.category === article.category && entry.slug !== article.slug
	);

	// "Keep reading" drops out when nothing else shares the category, so the
	// counter is built from what actually renders.
	const totalSections = related.length ? 3 : 2;
	const url = `${siteConfig.url}${RoutePath.ARTICLES}/${article.slug}`;
	const image = article.ogImage ?? article.coverImage;

	// Article and BreadcrumbList, so search results can show the byline, the
	// dates and a crumb trail rather than just a title and a URL.
	const structuredData = [
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: article.title,
			description: article.seoDescription ?? article.excerpt,
			datePublished: article.publishedAt,
			dateModified: article.updatedAt,
			author: authorSchema(article),
			publisher: {
				'@type': 'Organization',
				name: siteConfig.name,
				alternateName: siteConfig.fullname,
				url: siteConfig.url
			},
			mainEntityOfPage: { '@type': 'WebPage', '@id': url },
			...(image ? { image } : {}),
			articleSection: article.category,
			keywords: article.tags.join(', '),
			timeRequired: `PT${article.readingMinutes}M`,
			inLanguage: 'en-GB'
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: siteConfig.url
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Articles',
					item: `${siteConfig.url}${RoutePath.ARTICLES}`
				},
				{ '@type': 'ListItem', position: 3, name: article.title }
			]
		}
	];

	return (
		<>
			<script
				type="application/ld+json"
				// Serialised from data we control, never from user input.
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData)
				}}
			/>
			<TrackContentView
				type={ContentType.ARTICLE}
				id={article.slug}
				name={article.title}
			/>

			<ArticleDetailHero
				article={article}
				byline={articleByline}
			/>

			<article className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
				<ArticleBody body={article.body}>
					<ArticleReadDepth slug={article.slug} />
				</ArticleBody>
				<ArticleEngagementBar
					slug={article.slug}
					title={article.title}
					engagement={articleEngagement}
					options={articleEngagementOptions}
					className="mt-14"
				/>

				<ArticleBylineCard
					author={article.author}
					variant={articleByline}
					className="mt-10"
				/>
			</article>

			{articleEngagementOptions.comments ? (
				<ArticleComments comments={articleComments} />
			) : null}

			<ArticleRelated
				articles={related}
				category={article.category}
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<ArticlesCta
				sectionIndex={related.length ? 2 : 1}
				totalSections={totalSections}
				heading="Sound like your situation?"
				lead="Everything here came out of a real project. If one of them matches yours, a discovery call gets to the point faster."
			/>
		</>
	);
}
