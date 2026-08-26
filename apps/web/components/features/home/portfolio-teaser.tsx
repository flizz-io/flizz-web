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
					index={6}
					eyebrow="Our Work"
					title="Real projects, real impact"
					seeAllLabel="View all projects"
					seeAllHref="/portfolio"
				/>

				<div className="mt-14 grid gap-4 sm:grid-cols-3">
					{projectCards.map((project, index) => (
						<Reveal
							key={project.name}
							delay={index * 80}
						>
							<Link
								href="/portfolio"
								className="group flex h-full flex-col justify-between gap-10 bg-card p-7 transition-colors hover:bg-primary hover:text-primary-foreground"
							>
								<div className="flex items-start justify-between gap-2">
									<p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase opacity-70">
										{project.category}
									</p>
									<ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
								</div>
								<div>
									<h3 className="font-heading text-2xl font-semibold tracking-tight">
										{project.name}
									</h3>
									<p className="mt-2 text-sm opacity-80">
										{project.summary}
									</p>
								</div>
							</Link>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
