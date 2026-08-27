import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { serviceCards } from '@/constants/home';

export function ServicesTeaser() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
			<SectionHeader
				index={6}
				eyebrow="What We Build"
				title="Services for every stage of the build"
				description="A snapshot of what we do — the full list lives on the Services page."
				seeAllLabel="View all services"
				seeAllHref="/services"
			/>

			<div className="mt-14 border-t border-border">
				{serviceCards.map((service, index) => (
					<Reveal
						key={service.title}
						delay={index * 40}
					>
						<Link
							href="/services"
							className="group flex flex-col gap-3 border-b border-border py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
						>
							<div className="flex items-baseline gap-5 sm:gap-8">
								<span className="font-mono text-sm text-muted-foreground">
									{String(index + 1).padStart(2, '0')}
								</span>
								<div>
									<p className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">
										{service.category}
									</p>
									<h3 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
										{service.title}
									</h3>
								</div>
							</div>
							<div className="flex items-center gap-4 pl-12 sm:pl-0">
								<p className="max-w-xs text-sm text-muted-foreground">
									{service.description}
								</p>
								<ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
							</div>
						</Link>
					</Reveal>
				))}
			</div>
		</section>
	);
}
