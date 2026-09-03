import { Hammer } from 'lucide-react';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { Reveal } from '@/components/snippets/reveal/reveal';
import {
	portfolioHeroLead,
	portfolioMeta,
	projects
} from '@/constants/portfolio';
import { projectSectorOrder } from '@/enums/portfolio';
import { cn } from '@workspace/ui/lib/utils';

/**
 * Masthead, with the sectors we build in docked to the foot of it.
 *
 * They are a statement of range rather than a filter or a table of contents:
 * with the reel playing the highlighted work and the index carrying the rest,
 * a visitor's first question is whether we have built anything in their world,
 * and the counts answer it before they scroll. Keeping them inert also keeps
 * this whole page server-rendered, which a filter would not.
 */
export function PortfolioHero({ className }: { className?: string }) {
	const sectors = projectSectorOrder
		.map((sector) => ({
			sector,
			count: projects.filter((project) => project.sector === sector)
				.length
		}))
		.filter(({ count }) => count > 0);

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
							<Hammer className="size-3.5 text-primary" />
							Portfolio
						</span>

						<p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
							{portfolioMeta}
						</p>
					</div>

					<div className="mt-8 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
						<h1 className="max-w-2xl font-heading text-[clamp(2.5rem,4.6vw,3.75rem)] leading-[1.03] font-semibold tracking-tight text-balance text-foreground">
							Work we shipped, and what it changed
						</h1>

						<p className="max-w-2xl text-pretty text-muted-foreground lg:pb-1.5">
							{portfolioHeroLead}
						</p>
					</div>
				</Reveal>

				<Reveal
					delay={140}
					className="mt-10 border-t border-border pt-6 lg:mt-12"
				>
					<dl className="flex flex-wrap items-baseline gap-x-7 gap-y-3 font-mono text-[0.65rem] tracking-[0.18em] uppercase">
						{sectors.map(({ sector, count }) => (
							<div
								key={sector}
								className="flex items-baseline gap-2"
							>
								<dt className="text-muted-foreground">
									{sector}
								</dt>
								<dd className="text-primary">
									{String(count).padStart(2, '0')}
								</dd>
							</div>
						))}
					</dl>
				</Reveal>
			</div>
		</section>
	);
}
