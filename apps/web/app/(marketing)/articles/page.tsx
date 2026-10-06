import type { Metadata } from 'next';
import { Suspense } from 'react';

import {
	ArticlesControls,
	ArticlesControlsSkeleton
} from '@/components/features/articles/articles-controls';
import { ArticlesCta } from '@/components/features/articles/articles-cta';
import { ArticlesHero } from '@/components/features/articles/articles-hero';
import { ArticlesResults } from '@/components/features/articles/articles-results';
import { staticPageSeo } from '@/constants/seo';
import { RoutePath } from '@/enums/routes';
import { buildPageMetadata } from '@/utils/metadata';

export const metadata: Metadata = buildPageMetadata({
	...staticPageSeo[RoutePath.ARTICLES],
	path: RoutePath.ARTICLES
});

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
