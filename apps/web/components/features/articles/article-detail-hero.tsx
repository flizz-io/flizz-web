import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { ArticleByline as Byline } from '@/enums/articles';
import type { Article } from '@/types/articles';
import { formatArticleDate, getReadingMinutes } from '@/utils/articles';
import { cn } from '@workspace/ui/lib/utils';

interface ArticleDetailHeroProps {
	article: Article;
	byline?: Byline;
	className?: string;
}

/**
 * Centred on the reading column rather than left-aligned like the other page
 * heroes. This is the one page whose job is to be read, so the title sits over
 * the measure the body will use — the eye never has to travel sideways to find
 * where the text starts.
 */
export function ArticleDetailHero({
	article,
	byline = Byline.AUTHOR,
	className
}: ArticleDetailHeroProps) {
	const showAuthor = byline === Byline.AUTHOR;

	return (
		<section
			className={cn(
				'relative isolate -mt-16 overflow-hidden px-4 sm:px-6 lg:px-8',
				className
			)}
		>
			<Atmosphere intensity="quiet" />

			<div className="relative mx-auto max-w-2xl pt-36 pb-14 sm:pt-40 lg:pt-44">
				<Reveal trigger="mount">
					<Link
						href="/articles"
						className="group/back inline-flex items-center gap-2 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-foreground hover:underline"
					>
						<ArrowLeft className="size-3.5 transition-transform group-hover/back:-translate-x-0.5" />
						All articles
					</Link>

					<p className="mt-7 font-mono text-xs tracking-[0.2em] text-primary uppercase">
						{article.category}
					</p>

					<h1 className="mt-4 font-heading text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-semibold tracking-tight text-balance text-foreground">
						{article.title}
					</h1>

					<p className="mt-6 text-lg text-pretty text-muted-foreground">
						{article.excerpt}
					</p>

					<p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-5 font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
						{showAuthor ? (
							<>
								<span className="text-foreground">
									{article.author}
								</span>
								<span className="text-border">·</span>
							</>
						) : null}
						<time dateTime={article.publishedAt}>
							{formatArticleDate(article.publishedAt)}
						</time>
						<span className="text-border">·</span>
						{getReadingMinutes(article.body)} min read
					</p>
				</Reveal>
			</div>

			{/* Wider than the reading column on purpose — the banner is the one
			    element allowed to break the measure, so the article opens with
			    something before it narrows to text. */}
			<Reveal
				trigger="mount"
				delay={160}
				className="relative mx-auto max-w-5xl pb-4"
			>
				<div className="relative aspect-16/9 overflow-hidden rounded-xl border border-border sm:aspect-21/9">
					<MediaSlot
						src={article.coverImage}
						alt={article.title}
						label="Banner pending"
						sizes="(min-width: 1024px) 64rem, 100vw"
						priority
					/>
				</div>
			</Reveal>
		</section>
	);
}
