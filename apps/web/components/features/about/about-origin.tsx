import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import {
	aboutMilestones,
	aboutOriginLead,
	aboutOriginNote
} from '@/constants/about';
import { cn } from '@workspace/ui/lib/utils';

interface AboutOriginProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The one section where a sequence is genuinely load-bearing, so it gets the
 * rail. The markers are dates rather than 01/02/03 — the chronology is the
 * information here, and numbering it twice would say nothing extra.
 */
export function AboutOrigin({
	sectionIndex,
	totalSections,
	className
}: AboutOriginProps) {
	return (
		<section
			className={cn(
				'border-t border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8',
				className
			)}
		>
			<div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
				<div className="lg:sticky lg:top-28 lg:self-start">
					<Reveal>
						<SectionTag
							index={sectionIndex}
							total={totalSections}
							label="Where we came from"
						/>
						<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
							We were the client first
						</h2>
						<p className="mt-6 text-base text-pretty text-muted-foreground">
							{aboutOriginLead}
						</p>
					</Reveal>

					<Reveal
						delay={120}
						className="mt-8 border-l border-primary/40 pl-6"
					>
						<p className="font-serif text-lg text-pretty text-foreground italic">
							{aboutOriginNote}
						</p>
					</Reveal>
				</div>

				{/* The rail draws downward as the list arrives, so the years
				    read as elapsed time rather than as a static column. */}
				<Reveal
					delay={80}
					className="relative"
				>
					<span
						aria-hidden
						className="pointer-events-none absolute top-2 bottom-2 left-[0.3125rem] w-px origin-top scale-y-0 bg-gradient-to-b from-primary/50 via-primary/25 to-transparent transition-transform duration-[1800ms] ease-power-on group-data-[revealed=true]/reveal:scale-y-100"
					/>

					<ol className="space-y-11">
						{aboutMilestones.map((milestone, index) => (
							<li
								key={milestone.date}
								className="relative pl-10"
							>
								<span
									aria-hidden
									className={cn(
										'absolute top-1.5 left-0 size-2.5 rounded-full border bg-background',
										index === 0
											? 'border-primary bg-primary'
											: 'border-primary/50'
									)}
								/>

								<p className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">
									{milestone.date}
								</p>
								<h3 className="mt-2 font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
									{milestone.title}
								</h3>
								<p className="mt-2 max-w-lg text-sm text-pretty text-muted-foreground">
									{milestone.description}
								</p>
							</li>
						))}
					</ol>
				</Reveal>
			</div>
		</section>
	);
}
