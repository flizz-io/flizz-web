import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import { Reveal } from '@/components/snippets/reveal/reveal';
import type { ProjectDetail } from '@/types/portfolio';
import { getProjectService } from '@/utils/portfolio';
import { cn } from '@workspace/ui/lib/utils';

interface ProjectDetailHeroProps {
	project: ProjectDetail;
	className?: string;
}

/**
 * The facts before the story. Anyone deciding whether to read a case study is
 * really asking four questions — who was it for, how long did it take, how big
 * was the team, and what kind of work was it — so those sit above the fold as a
 * ledger rather than being buried in the narrative.
 */
export function ProjectDetailHero({
	project,
	className
}: ProjectDetailHeroProps) {
	const service = getProjectService(project);

	const facts = [
		{ term: 'Client', detail: project.client },
		{ term: 'Duration', detail: project.duration },
		{ term: 'Team', detail: project.team }
	];

	return (
		<section
			className={cn(
				'relative isolate -mt-16 overflow-hidden px-4 sm:px-6 lg:px-8',
				className
			)}
		>
			<Atmosphere />

			<div className="relative mx-auto max-w-7xl pt-36 pb-12 sm:pt-40 lg:pt-44">
				<Reveal trigger="mount">
					<Link
						href="/portfolio"
						className="group/back inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-foreground hover:underline"
					>
						<ArrowLeft className="size-3.5 transition-transform group-hover/back:-translate-x-0.5" />
						All work
					</Link>

					<p className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-[0.2em] uppercase">
						<span className="text-primary">{project.sector}</span>
						<span className="text-border">·</span>
						<span className="text-muted-foreground">
							{project.year}
						</span>
					</p>

					<h1 className="mt-4 max-w-3xl font-heading text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.05] font-semibold tracking-tight text-balance text-foreground">
						{project.name}
					</h1>

					<p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
						{project.summary}
					</p>

					<dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
						{facts.map((fact) => (
							<div key={fact.term}>
								<dt className="font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
									{fact.term}
								</dt>
								<dd className="mt-1.5 text-sm text-pretty text-foreground">
									{fact.detail}
								</dd>
							</div>
						))}

						<div>
							<dt className="font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
								Delivered as
							</dt>
							<dd className="mt-1.5 text-sm text-pretty text-foreground">
								{service ? (
									<Link
										href={`/services/${service.slug}`}
										className="underline-offset-4 transition-colors hover:text-primary hover:underline"
									>
										{service.title}
									</Link>
								) : (
									project.service
								)}
							</dd>
						</div>
					</dl>
				</Reveal>
			</div>

			{/* The one element allowed past the text measure, so the case study
			    opens on the work before it narrows to prose. */}
			<Reveal
				trigger="mount"
				delay={160}
				className="relative mx-auto max-w-5xl pb-4"
			>
				<div className="relative aspect-16/9 overflow-hidden rounded-xl border border-border sm:aspect-21/9">
					<MediaSlot
						src={project.image}
						alt={project.name}
						label="Screenshot pending"
						sizes="(min-width: 1024px) 64rem, 100vw"
						priority
					/>
				</div>
			</Reveal>
		</section>
	);
}
