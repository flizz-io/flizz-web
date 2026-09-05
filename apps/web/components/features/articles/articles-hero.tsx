import { PenLine } from 'lucide-react';
import type { ReactNode } from 'react';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { articles, articlesHeroLead } from '@/constants/articles';
import { cn } from '@workspace/ui/lib/utils';

interface ArticlesHeroProps {
	/** Browse controls, docked to the foot of the masthead. */
	children?: ReactNode;
	className?: string;
}

/**
 * Masthead and browse controls as one block.
 *
 * The controls sit here rather than in a section of their own because a reader
 * who came to read something shouldn't scroll past a full-height statement and
 * then a filter panel before the first title appears. Standing the lead beside
 * the heading instead of under it buys the room for them.
 *
 * The controls arrive through `children` so the masthead stays a server
 * component: they read the query string, which takes them out of the
 * prerendered HTML, and the heading shouldn't go with them.
 */
export function ArticlesHero({ children, className }: ArticlesHeroProps) {
	const latest = articles.reduce((newest, article) =>
		article.publishedAt > newest.publishedAt ? article : newest
	);

	return (
		<section
			className={cn(
				// Pulled up under the sticky header, which takes its own 4rem of
				// flow above `main` and would otherwise sit outside the film.
				'relative isolate -mt-16 overflow-hidden px-4 sm:px-6 lg:px-8',
				className
			)}
		>
			<Atmosphere />

			<div className="relative mx-auto max-w-7xl pt-36 pb-10 sm:pt-40 lg:pt-44 lg:pb-12">
				<Reveal trigger="mount">
					<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
						<span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase backdrop-blur-sm dark:text-white/75">
							<PenLine className="size-3.5 text-primary" />
							Articles
						</span>

						{/* Says the writing is current, which is what a visitor
						    is actually judging on an articles index. The count
						    lives on the index header, where it answers to the
						    filters. */}
						<p className="font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
							Last updated
							<span className="ml-3 text-foreground">
								{new Date(
									latest.publishedAt
								).toLocaleDateString('en-GB', {
									month: 'long',
									year: 'numeric'
								})}
							</span>
						</p>
					</div>

					<div className="mt-8 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
						<h1 className="max-w-2xl font-heading text-[clamp(2.5rem,4.6vw,3.75rem)] leading-[1.03] font-semibold tracking-tight text-balance text-foreground">
							What we{' '}
							<span className="font-serif text-primary italic">
								learned
							</span>{' '}
							building it
						</h1>

						<p className="max-w-2xl text-pretty text-muted-foreground lg:pb-1.5">
							{articlesHeroLead}
						</p>
					</div>
				</Reveal>

				{children ? (
					<Reveal
						delay={140}
						className="mt-10 border-t border-border pt-6 lg:mt-12"
					>
						{children}
					</Reveal>
				) : null}
			</div>
		</section>
	);
}
