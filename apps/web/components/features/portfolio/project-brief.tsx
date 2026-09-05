import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { cn } from '@workspace/ui/lib/utils';

interface ProjectBriefProps {
	brief: string[];
	constraints: string[];
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The situation before us, in the client's terms. The constraints sit with it
 * rather than in the solution: they are what the client brought to the table,
 * and they explain most of the decisions in the section that follows.
 */
export function ProjectBrief({
	brief,
	constraints,
	sectionIndex,
	totalSections,
	className
}: ProjectBriefProps) {
	return (
		<section
			className={cn('px-4 py-20 sm:px-6 sm:py-28 lg:px-8', className)}
		>
			<div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-20">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="The brief"
					/>
					<h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
						What we were called into
					</h2>
				</Reveal>

				<div>
					<Reveal delay={100}>
						{brief.map((paragraph, index) => (
							<p
								key={paragraph}
								className={cn(
									'max-w-3xl text-lg text-pretty text-muted-foreground sm:text-xl',
									index > 0 && 'mt-6'
								)}
							>
								{paragraph}
							</p>
						))}
					</Reveal>

					{constraints.length ? (
						<Reveal
							delay={180}
							className="mt-12"
						>
							<p className="font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
								What the answer had to survive
							</p>

							<ul className="mt-5 max-w-3xl space-y-px">
								{constraints.map((constraint) => (
									<li
										key={constraint}
										className="border-t border-border py-4 text-pretty text-foreground last:border-b"
									>
										{constraint}
									</li>
								))}
							</ul>
						</Reveal>
					) : null}
				</div>
			</div>
		</section>
	);
}
