import { PenLine } from 'lucide-react';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { articles, articlesHeroLead } from '@/constants/articles';
import { cn } from '@workspace/ui/lib/utils';

export function ArticlesHero({ className }: { className?: string }) {
	const latest = articles.reduce((newest, article) =>
		article.publishedAt > newest.publishedAt ? article : newest
	);

	return (
		<section
			className={cn(
				'relative isolate -mt-16 overflow-hidden px-4 sm:px-6 lg:px-8',
				className
			)}
		>
			<Atmosphere />

			<div className="relative mx-auto max-w-7xl pt-40 pb-16 sm:pt-44 lg:pt-48 lg:pb-20">
				<Reveal trigger="mount">
					<span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase backdrop-blur-sm dark:text-white/75">
						<PenLine className="size-3.5 text-primary" />
						Articles
					</span>

					<h1 className="mt-7 max-w-3xl font-heading text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.03] font-semibold tracking-tight text-balance text-foreground">
						What we{' '}
						<span className="font-serif text-primary italic">
							learned
						</span>{' '}
						building it
					</h1>

					<p className="mt-7 max-w-2xl text-lg text-pretty text-muted-foreground">
						{articlesHeroLead}
					</p>

					{/* Says the writing is current, which is what a visitor is
					    actually judging on an articles index. */}
					<p className="mt-10 border-t border-border pt-5 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
						{articles.length} pieces
						<span className="mx-3 text-border">/</span>
						Last updated
						<span className="ml-3 text-foreground">
							{new Date(latest.publishedAt).toLocaleDateString(
								'en-GB',
								{ month: 'long', year: 'numeric' }
							)}
						</span>
					</p>
				</Reveal>
			</div>
		</section>
	);
}
