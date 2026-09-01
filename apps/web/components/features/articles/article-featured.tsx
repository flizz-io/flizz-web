import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { articles } from '@/constants/articles';
import { formatArticleDate, getReadingMinutes } from '@/utils/articles';
import { cn } from '@workspace/ui/lib/utils';

interface ArticleFeaturedProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The most recent piece, given room. An archive of equal rows makes everything
 * look equally old — one lead entry says which thing to read if you only read
 * one, and gives the page somewhere to start.
 */
export function ArticleFeatured({
	sectionIndex,
	totalSections,
	className
}: ArticleFeaturedProps) {
	const [featured] = [...articles].sort((a, b) =>
		b.publishedAt.localeCompare(a.publishedAt)
	);

	if (!featured) return null;

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-24 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Latest"
					/>
				</Reveal>

				<Reveal delay={90}>
					<Link
						href={`/articles/${featured.slug}`}
						className="group/lead mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16"
					>
						<div className="lg:col-span-2">
							<div className="relative aspect-16/9 overflow-hidden rounded-xl border border-border transition-colors group-hover/lead:border-primary/40 sm:aspect-21/9">
								<MediaSlot
									src={featured.coverImage}
									alt={featured.title}
									label="Cover pending"
									sizes="(min-width: 1024px) 72rem, 100vw"
								/>
							</div>
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

							<h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground transition-colors group-hover/lead:text-primary sm:text-4xl lg:text-5xl">
								{featured.title}
							</h2>
						</div>

						<div>
							<p className="text-lg text-pretty text-muted-foreground">
								{featured.excerpt}
							</p>
							<span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] text-foreground uppercase underline-offset-4 group-hover/lead:text-primary group-hover/lead:underline">
								Read it
								<ArrowUpRight className="size-3.5 transition-transform group-hover/lead:translate-x-0.5 group-hover/lead:-translate-y-0.5" />
							</span>
						</div>
					</Link>
				</Reveal>
			</div>
		</section>
	);
}
