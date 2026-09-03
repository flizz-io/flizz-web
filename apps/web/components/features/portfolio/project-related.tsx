import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { ProjectShift } from '@/components/features/portfolio/project-shift';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import type { Project } from '@/types/portfolio';
import { cn } from '@workspace/ui/lib/utils';

interface ProjectRelatedProps {
	projects: Project[];
	sector: string;
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/** The rest of the sector, in the index's own row idiom. */
export function ProjectRelated({
	projects,
	sector,
	sectionIndex,
	totalSections,
	className
}: ProjectRelatedProps) {
	if (!projects.length) return null;

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<SectionTag
							index={sectionIndex}
							total={totalSections}
							label="Nearby work"
						/>
						<h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
							More in {sector}
						</h2>
					</div>

					<Link
						href="/portfolio"
						className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-sm text-foreground underline-offset-4 hover:text-primary hover:underline"
					>
						All work
						<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
				</Reveal>

				<ul className="mt-10">
					{projects.map((project, index) => (
						<Reveal
							key={project.slug}
							delay={index * 70}
						>
							<li>
								<Link
									href={`/portfolio/${project.slug}`}
									className="group/row grid gap-5 border-b border-border py-6 first:border-t sm:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] sm:items-start sm:gap-12"
								>
									<span className="min-w-0">
										<span className="flex items-baseline gap-2">
											<span className="font-heading text-lg font-semibold tracking-tight text-balance text-foreground transition-colors group-hover/row:text-primary sm:text-xl">
												{project.name}
											</span>
											<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-primary" />
										</span>
										<span className="mt-1.5 block max-w-xl text-sm text-pretty text-muted-foreground">
											{project.summary}
										</span>
									</span>

									{project.results[0] ? (
										<ProjectShift
											result={project.results[0]}
											align="right"
										/>
									) : null}
								</Link>
							</li>
						</Reveal>
					))}
				</ul>
			</div>
		</section>
	);
}
