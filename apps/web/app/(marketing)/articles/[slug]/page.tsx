import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleBody } from '@/components/features/articles/article-body';
import { ArticleBylineCard } from '@/components/features/articles/article-byline';
import { ArticleComments } from '@/components/features/articles/article-comments';
import { ArticleDetailHero } from '@/components/features/articles/article-detail-hero';
import { ArticleEngagementBar } from '@/components/features/articles/article-engagement';
import { ArticleRelated } from '@/components/features/articles/article-related';
import { ArticlesCta } from '@/components/features/articles/articles-cta';
import { siteConfig } from '@/configs/site';
import {
	articleByline,
	articleComments,
	articleEngagement,
	articleEngagementOptions,
	articles
} from '@/constants/articles';
import { getReadingMinutes } from '@/utils/articles';

interface ArticlePageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
	return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
	params
}: ArticlePageProps): Promise<Metadata> {
	const { slug } = await params;
	const article = articles.find((entry) => entry.slug === slug);

	if (!article) return {};

	const url = `${siteConfig.url}/articles/${article.slug}`;

	return {
		title: article.title,
		description: article.excerpt,
		keywords: [article.category, 'software engineering', siteConfig.name],
		authors: [{ name: article.author }],
		alternates: { canonical: url },
		openGraph: {
			type: 'article',
			url,
			siteName: siteConfig.fullname,
			title: article.title,
			description: article.excerpt,
			publishedTime: article.publishedAt,
			authors: [article.author],
			section: article.category
		},
		twitter: {
			card: 'summary_large_image',
			title: article.title,
			description: article.excerpt
		}
	};
}

export default async function ArticlePage({ params }: ArticlePageProps) {
	const { slug } = await params;
	const article = articles.find((entry) => entry.slug === slug);

	if (!article) notFound();

	const related = articles
		.filter(
			(entry) =>
				entry.category === article.category &&
				entry.slug !== article.slug
		)
		.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

	// "Keep reading" drops out when nothing else shares the category, so the
	// counter is built from what actually renders.
	const totalSections = related.length ? 3 : 2;
	const url = `${siteConfig.url}/articles/${article.slug}`;

	// Article and BreadcrumbList, so search results can show the byline, the
	// date and a crumb trail rather than just a title and a URL.
	const structuredData = [
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: article.title,
			description: article.excerpt,
			datePublished: article.publishedAt,
			dateModified: article.publishedAt,
			author: { '@type': 'Person', name: article.author },
			publisher: {
				'@type': 'Organization',
				name: siteConfig.fullname,
				url: siteConfig.url
			},
			mainEntityOfPage: { '@type': 'WebPage', '@id': url },
			articleSection: article.category,
			timeRequired: `PT${getReadingMinutes(article.body)}M`,
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
					item: `${siteConfig.url}/articles`
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

			<ArticleDetailHero
				article={article}
				byline={articleByline}
			/>

			<article className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
				<ArticleBody body={article.body} />
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
