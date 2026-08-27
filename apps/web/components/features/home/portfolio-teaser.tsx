import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { projectCards } from '@/constants/home';

// Generated cover art standing in for real project screenshots — an open PM item (see docs/requirements/home-page.md)
function ProjectCover({ seed }: { seed: number }) {
	const angle = 40 + seed * 55;
	const blockWidthSets: string[][] = [
		['60%', '85%', '40%'],
		['70%', '45%', '55%'],
		['50%', '90%', '65%']
	];
	const blockWidths = blockWidthSets[seed % blockWidthSets.length] ?? [];

	return (
		<div
			aria-hidden
			className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border"
			style={{
				backgroundImage: `linear-gradient(${angle}deg, var(--color-primary) 0%, var(--color-background) 70%)`
			}}
		>
			<div
				className="absolute inset-0 opacity-25"
				style={{
					backgroundImage:
						'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
					backgroundSize: '14px 14px'
				}}
			/>

			<div className="absolute inset-4 flex flex-col gap-2 rounded-sm border border-primary-foreground/15 bg-background/70 p-3 backdrop-blur-sm">
				<div className="flex gap-1.5">
					<span className="size-1.5 rounded-full bg-muted-foreground/40" />
					<span className="size-1.5 rounded-full bg-muted-foreground/40" />
					<span className="size-1.5 rounded-full bg-muted-foreground/40" />
				</div>
				<div className="mt-1 flex flex-col gap-1.5">
					{blockWidths.map((width, index) => (
						<span
							key={index}
							className="h-2 rounded-full bg-muted-foreground/25"
							style={{ width }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export function PortfolioTeaser() {
	return (
		<section className="border-t border-border">
			<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<SectionHeader
					index={7}
					eyebrow="Our Work"
					title="Real projects, real impact"
					seeAllLabel="View all projects"
					seeAllHref="/portfolio"
				/>

				<div className="mt-14 grid gap-6 sm:grid-cols-3">
					{projectCards.map((project, index) => (
						<Reveal
							key={project.name}
							delay={index * 80}
						>
							<Link
								href="/portfolio"
								className="group block"
							>
								<div className="transition-transform duration-300 group-hover:-translate-y-1">
									<ProjectCover seed={index} />
								</div>
								<div className="mt-4 flex items-start justify-between gap-2">
									<div>
										<p className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">
											{project.category}
										</p>
										<h3 className="mt-1 font-heading text-lg font-semibold tracking-tight text-foreground">
											{project.name}
										</h3>
									</div>
									<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
								</div>
								<p className="mt-1.5 text-sm text-muted-foreground">
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
