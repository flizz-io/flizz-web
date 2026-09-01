import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { articles } from '@/constants/articles';
import { formatArticleDate, getReadingMinutes } from '@/utils/articles';
import { cn } from '@workspace/ui/lib/utils';

interface ArticlesArchiveProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * Reverse-chronological, with the date leading each row.
 *
 * That is the difference from the services index, whose rows lead with the
 * title: there, order carried nothing, so numbering or dating it would have
 * been decoration. Here the chronology *is* the organising information — a
 * reader wants to know how current a piece is before they want its name — and
 * leading with it keeps the two pages from reading as the same list twice.
 */
export function ArticlesArchive({
	sectionIndex,
	totalSections,
	className
}: ArticlesArchiveProps) {
	const [, ...rest] = [...articles].sort((a, b) =>
		b.publishedAt.localeCompare(a.publishedAt)
	);

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Everything else"
					/>
				</Reveal>

				<ul className="mt-10">
					{rest.map((article, index) => (
						<Reveal
							key={article.slug}
							delay={index * 60}
						>
							<li>
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

									<span className="relative hidden aspect-16/9 overflow-hidden rounded-md border border-border transition-colors group-hover/row:border-primary/40 sm:block">
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
									</span>

									<span className="flex items-center gap-4 font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
										{article.category}
										<span className="text-border">·</span>
										{getReadingMinutes(article.body)} min
										<ArrowUpRight className="size-4 shrink-0 transition-transform group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-primary" />
									</span>
								</Link>
							</li>
						</Reveal>
					))}
				</ul>
			</div>
		</section>
	);
}
