import { Compass } from 'lucide-react';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { Reveal } from '@/components/snippets/reveal/reveal';
import {
	aboutFigures,
	aboutHeroHeading,
	aboutHeroHeadingAccent,
	aboutHeroLead
} from '@/constants/about';
import { cn } from '@workspace/ui/lib/utils';

/**
 * The thesis first, the evidence directly under it. The figures sit in the
 * hero rather than further down because they are the fastest answer to the
 * question this page exists to settle — whether there is a real company here.
 */
export function AboutHero({ className }: { className?: string }) {
	return (
		<section
			className={cn(
				// Pulled up under the header, which is `sticky` and takes its
				// own 4rem of flow above `main`. Left alone, that strip gets
				// none of the atmosphere and reads as a band across the top.
				'relative isolate -mt-16 overflow-hidden px-4 sm:px-6 lg:px-8',
				className
			)}
		>
			<Atmosphere />

			<div className="relative mx-auto max-w-7xl pt-40 pb-20 sm:pt-44 lg:pt-48 lg:pb-28">
				<Reveal trigger="mount">
					<span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase backdrop-blur-sm dark:text-white/75">
						<Compass className="size-3.5 text-primary" />
						About
					</span>

					<h1 className="mt-7 max-w-4xl font-heading text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.03] font-semibold tracking-tight text-balance text-foreground">
						{aboutHeroHeading}{' '}
						<span className="font-serif text-primary italic">
							{aboutHeroHeadingAccent}
						</span>
					</h1>

					<p className="mt-7 max-w-2xl text-lg text-pretty text-muted-foreground">
						{aboutHeroLead}
					</p>
				</Reveal>

				{/* The rule draws outward as the figures land, so the strip
				    reads as one measurement rather than four loose numbers. */}
				<Reveal
					delay={160}
					className="relative mt-16 border-t border-border pt-10"
				>
					<span
						aria-hidden
						className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary/60 via-primary/25 to-transparent transition-transform duration-[1600ms] ease-power-on group-data-[revealed=true]/reveal:scale-x-100"
					/>

					<dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
						{aboutFigures.map((figure) => (
							<div key={figure.label}>
								<dt className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
									{figure.value}
									{figure.suffix ? (
										<span className="text-primary">
											{figure.suffix}
										</span>
									) : null}
								</dt>
								<dd className="mt-2 font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
									{figure.label}
								</dd>
							</div>
						))}
					</dl>
				</Reveal>
			</div>
		</section>
	);
}
