import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { serviceCards } from '@/constants/home';

export function ServicesTeaser() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
			<SectionHeader
				eyebrow="What We Build"
				title="Services for every stage of the build"
				description="A snapshot of what we do — the full list lives on the Services page."
				seeAllLabel="View all services"
				seeAllHref="/services"
			/>

			<div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
				{serviceCards.map((service, index) => (
					<Reveal
						key={service.title}
						delay={index * 60}
						className="group bg-background p-6"
					>
						<Link
							href="/services"
							className="flex h-full flex-col"
						>
							<p className="font-mono text-[0.65rem] tracking-[0.15em] text-primary uppercase">
								{service.category}
							</p>
							<h3 className="mt-3 flex items-center gap-1.5 font-heading text-base font-semibold tracking-tight text-foreground">
								{service.title}
								<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
							</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								{service.description}
							</p>
						</Link>
					</Reveal>
				))}
			</div>
		</section>
	);
}
