import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { projectCards } from '@/constants/home';

export function PortfolioTeaser() {
	return (
		<section className="border-t border-border bg-secondary/30">
			<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<SectionHeader
					eyebrow="Our Work"
					title="Real Projects, Real Impact"
					seeAllLabel="View all projects"
					seeAllHref="/portfolio"
				/>

				<div className="mt-12 grid gap-6 sm:grid-cols-3">
					{projectCards.map((project, index) => (
						<Reveal
							key={project.name}
							delay={index * 80}
						>
							<Link
								href="/portfolio"
								className="group flex h-full flex-col rounded-md border border-border bg-card p-6 transition-colors hover:border-primary/40"
							>
								<div className="flex items-start justify-between gap-2">
									<p className="font-mono text-[0.65rem] tracking-[0.15em] text-primary uppercase">
										{project.category}
									</p>
									<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
								</div>
								<h3 className="mt-3 font-heading text-lg font-semibold tracking-tight text-foreground">
									{project.name}
								</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									{project.summary}
								</p>
							</Link>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
