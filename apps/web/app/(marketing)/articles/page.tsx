import type { Metadata } from 'next';
import { Suspense } from 'react';

import {
	ArticlesControls,
	ArticlesControlsSkeleton
} from '@/components/features/articles/articles-controls';
import { ArticlesCta } from '@/components/features/articles/articles-cta';
import { ArticlesHero } from '@/components/features/articles/articles-hero';
import { ArticlesResults } from '@/components/features/articles/articles-results';
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
	const totalSections = 2;

	return (
		<>
			{/* Controls and results both read filter state from the query
			    string, so each needs a boundary of its own — that is what keeps
			    the masthead around them in the statically rendered shell. */}
			<ArticlesHero>
				<Suspense fallback={<ArticlesControlsSkeleton />}>
					<ArticlesControls />
				</Suspense>
			</ArticlesHero>

			<Suspense>
				<ArticlesResults
					sectionIndex={1}
					totalSections={totalSections}
				/>
			</Suspense>

			<ArticlesCta
				sectionIndex={2}
				totalSections={totalSections}
			/>
		</>
	);
}
