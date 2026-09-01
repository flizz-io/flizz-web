import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceProblemProps {
	problem: string;
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/** What the service is for, in the client's terms rather than ours. */
export function ServiceProblem({
	problem,
	sectionIndex,
	totalSections,
	className
}: ServiceProblemProps) {
	return (
		<section
			className={cn('px-4 py-20 sm:px-6 sm:py-28 lg:px-8', className)}
		>
			<div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-20">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Why this exists"
					/>
					<h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
						The problem it solves
					</h2>
				</Reveal>

				<Reveal delay={100}>
					<p className="max-w-3xl text-lg text-pretty text-muted-foreground sm:text-xl">
						{problem}
					</p>
				</Reveal>
			</div>
		</section>
	);
}
