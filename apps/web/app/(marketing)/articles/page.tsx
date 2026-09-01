import type { Metadata } from 'next';

import { ArticleFeatured } from '@/components/features/articles/article-featured';
import { ArticlesArchive } from '@/components/features/articles/articles-archive';
import { ArticlesCta } from '@/components/features/articles/articles-cta';
import { ArticlesHero } from '@/components/features/articles/articles-hero';
import { siteConfig } from '@/configs/site';

const description =
	'Notes on building software that has to keep working — what we argue about, what we got wrong, and the decisions that turned out to matter.';

export const metadata: Metadata = {
	title: 'Articles',
	description,
	alternates: { canonical: `${siteConfig.url}/articles` },
	openGraph: {
		type: 'website',
		url: `${siteConfig.url}/articles`,
		siteName: siteConfig.fullname,
		title: `Articles — ${siteConfig.name}`,
		description
	},
	twitter: {
		card: 'summary_large_image',
		title: `Articles — ${siteConfig.name}`,
		description
	}
};

export default function ArticlesPage() {
	const totalSections = 3;

	return (
		<>
			<ArticlesHero />
			<ArticleFeatured
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<ArticlesArchive
				sectionIndex={2}
				totalSections={totalSections}
			/>
			<ArticlesCta
				sectionIndex={3}
				totalSections={totalSections}
			/>
		</>
	);
}
