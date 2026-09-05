import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { cn } from '@workspace/ui/lib/utils';

interface ProjectBuildProps {
	approach: string[];
	built: string[];
	stack: string[];
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * How the work was approached, beside what was left behind. The reasoning gets
 * the wider column: a list of deliverables is the same list on every agency
 * site, and the decisions behind it are the only part that is ours.
 */
export function ProjectBuild({
	approach,
	built,
	stack,
	sectionIndex,
	totalSections,
	className
}: ProjectBuildProps) {
	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="The work"
					/>
					<h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
						How we went at it
					</h2>
				</Reveal>

				<div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-0">
					<Reveal className="lg:pr-16">
						{approach.map((paragraph, index) => (
							<p
								key={paragraph}
								className={cn(
									'max-w-2xl text-lg text-pretty text-muted-foreground',
									index > 0 && 'mt-6'
								)}
							>
								{paragraph}
							</p>
						))}
					</Reveal>

					<Reveal
						delay={90}
						className="lg:border-l lg:border-border lg:pl-16"
					>
						<p className="font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
							What we handed over
						</p>

						<ul className="mt-5 space-y-px">
							{built.map((item) => (
								<li
									key={item}
									className="border-t border-border py-3.5 text-pretty text-foreground last:border-b"
								>
									{item}
								</li>
							))}
						</ul>

						{stack.length ? (
							<>
								<p className="mt-10 font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
									Built with
								</p>

								<ul className="mt-4 flex flex-wrap gap-2">
									{stack.map((tool) => (
										<li
											key={tool}
											className="rounded-full border border-border px-3 py-1 font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground uppercase"
										>
											{tool}
										</li>
									))}
								</ul>
							</>
						) : null}
					</Reveal>
				</div>
			</div>
		</section>
	);
}
