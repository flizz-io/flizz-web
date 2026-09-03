import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import type { Article } from '@/types/articles';
import { formatArticleDate, getReadingMinutes } from '@/utils/articles';
import { cn } from '@workspace/ui/lib/utils';

interface ArticleRelatedProps {
	articles: Article[];
	category: string;
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/** The rest of the same category, in the archive's own row idiom. */
export function ArticleRelated({
	articles,
	category,
	sectionIndex,
	totalSections,
	className
}: ArticleRelatedProps) {
	if (!articles.length) return null;

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<SectionTag
							index={sectionIndex}
							total={totalSections}
							label="Keep reading"
						/>
						<h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
							More on {category}
						</h2>
					</div>

					<Link
						href="/articles"
						className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-sm text-foreground underline-offset-4 hover:text-primary hover:underline"
					>
						All articles
						<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
				</Reveal>

				<ul className="mt-10">
					{articles.map((article, index) => (
						<Reveal
							key={article.slug}
							delay={index * 70}
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
									</span>

									<span className="flex items-center gap-4 font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
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
