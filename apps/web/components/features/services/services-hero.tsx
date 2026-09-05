import { Layers } from 'lucide-react';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { services, servicesHeroLead } from '@/constants/services';
import { serviceCategoryOrder } from '@/enums/services';
import { cn } from '@workspace/ui/lib/utils';

/**
 * A list page's hero should say what the list contains, so the four areas are
 * named here rather than left to be discovered by scrolling. No figures strip —
 * that belongs to About, and this page is a routing surface, not an argument.
 */
export function ServicesHero({ className }: { className?: string }) {
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

			<div className="relative mx-auto max-w-7xl pt-40 pb-20 sm:pt-44 lg:pt-48 lg:pb-24">
				<Reveal trigger="mount">
					<span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase backdrop-blur-sm dark:text-white/75">
						<Layers className="size-3.5 text-primary" />
						Services
					</span>

					<h1 className="mt-7 max-w-3xl font-heading text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.03] font-semibold tracking-tight text-balance text-foreground">
						What we{' '}
						<span className="font-serif text-primary italic">
							actually
						</span>{' '}
						build
					</h1>

					<p className="mt-7 max-w-2xl text-lg text-pretty text-muted-foreground">
						{servicesHeroLead}
					</p>
				</Reveal>

				<Reveal
					delay={160}
					className="mt-14 border-t border-border pt-6"
				>
					<ul className="flex flex-wrap gap-x-10 gap-y-3">
						{serviceCategoryOrder.map((category) => (
							<li
								key={category}
								className="font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase"
							>
								{category}
								<span className="ml-2 text-primary">
									{
										services.filter(
											(service) =>
												service.category === category
										).length
									}
								</span>
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
