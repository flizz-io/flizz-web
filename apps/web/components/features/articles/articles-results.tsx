'use client';

import { ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';

import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { useArticleFilters } from '@/hooks/use-article-filters';
import { formatArticleDate, getReadingMinutes } from '@/utils/articles';
import { cn } from '@workspace/ui/lib/utils';

interface ArticlesResultsProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The index itself: what the toolbar in the masthead currently selects.
 *
 * The filter state is read straight from the query string rather than passed
 * down from the controls, so the two can sit in different parts of the tree —
 * the toolbar docked to the hero, the results in their own section — without a
 * provider between them.
 *
 * The featured card is here rather than beside it because it has to disappear
 * while a filter is active: promoting one piece above a set the reader has
 * deliberately narrowed makes the result look wrong.
 */
export function ArticlesResults({
	sectionIndex,
	totalSections,
	className
}: ArticlesResultsProps) {
	const { results, isFiltered, clear } = useArticleFilters();

	const [featured, ...rest] = results;
	const rows = isFiltered ? results : rest;

	return (
		<section
			className={cn(
				'border-t border-border px-4 pt-6 pb-16 sm:px-6 sm:pb-20 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="The index"
					/>

					<div className="flex items-center gap-4">
						<p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
							{results.length}{' '}
							{results.length === 1 ? 'article' : 'articles'}
							{isFiltered ? ' matched' : ''}
						</p>

						{isFiltered ? (
							<button
								type="button"
								onClick={clear}
								className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-foreground hover:underline"
							>
								<X className="size-3.5" />
								Clear filters
							</button>
						) : null}
					</div>
				</div>

				{/* Only when unfiltered — see the note on the component. */}
				{!isFiltered && featured ? (
					<Link
						href={`/articles/${featured.slug}`}
						className="group/lead mt-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
					>
						{/* Beside the copy rather than spanning the width: a
						    full-bleed 21:9 plate here repeats the detail page's
						    banner and swallows the section on the way past. */}
						<div className="relative aspect-16/9 overflow-hidden rounded-xl border border-border transition-colors group-hover/lead:border-primary/40">
							<MediaSlot
								src={featured.coverImage}
								alt={featured.title}
								label="Cover pending"
								sizes="(min-width: 1024px) 34rem, 100vw"
							/>
						</div>

						<div>
							<p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
								<span className="text-primary">
									{featured.category}
								</span>
								<span className="text-border">·</span>
								<time dateTime={featured.publishedAt}>
									{formatArticleDate(featured.publishedAt)}
								</time>
								<span className="text-border">·</span>
								{getReadingMinutes(featured.body)} min read
							</p>
							<h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground transition-colors group-hover/lead:text-primary sm:text-4xl">
								{featured.title}
							</h2>
							<p className="mt-5 text-lg text-pretty text-muted-foreground">
								{featured.excerpt}
							</p>
							<span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] text-foreground uppercase underline-offset-4 group-hover/lead:text-primary group-hover/lead:underline">
								Read it
								<ArrowUpRight className="size-3.5 transition-transform group-hover/lead:translate-x-0.5 group-hover/lead:-translate-y-0.5" />
							</span>
						</div>
					</Link>
				) : null}

				{rows.length ? (
					<ul className="mt-10">
						{rows.map((article) => (
							<li key={article.slug}>
								<Link
									href={`/articles/${article.slug}`}
									className="group/row grid gap-2 border-b border-border py-6 first:border-t sm:grid-cols-[9.5rem_7rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
								>
									<time
										dateTime={article.publishedAt}
										className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase"
									>
										{formatArticleDate(article.publishedAt)}
									</time>

									<span className="relative hidden aspect-16/9 overflow-hidden rounded-md border border-border transition-colors group-hover/row:border-primary/40 sm:mt-0.5 sm:block sm:self-start">
										<MediaSlot
											src={article.coverImage}
											alt={article.title}
											label="Cover"
											sizes="7rem"
										/>
									</span>

									<span className="min-w-0">
										<span className="block font-heading text-lg font-semibold tracking-tight text-balance text-foreground transition-colors group-hover/row:text-primary sm:text-xl">
											{article.title}
										</span>
										<span className="mt-1.5 block max-w-xl text-sm text-pretty text-muted-foreground">
											{article.excerpt}
										</span>
										<span className="mt-3 flex flex-wrap gap-2">
											{article.tags.map((entry) => (
												<span
													key={entry}
													className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase"
												>
													{entry}
												</span>
											))}
										</span>
									</span>

									<span className="flex items-center gap-4 font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
										{article.category}
										<span className="text-border">·</span>
										{getReadingMinutes(article.body)} min
										<ArrowUpRight className="size-4 shrink-0 transition-transform group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-primary" />
									</span>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
						<p className="font-heading text-lg font-semibold text-foreground">
							Nothing matches that
						</p>
						<p className="max-w-sm text-sm text-pretty text-muted-foreground">
							Try a shorter search, or drop one of the filters.
						</p>
						<button
							type="button"
							onClick={clear}
							className="mt-2 font-mono text-[0.65rem] tracking-[0.18em] text-primary uppercase underline-offset-4 hover:underline"
						>
							Clear filters
						</button>
					</div>
				)}
			</div>
		</section>
	);
}
