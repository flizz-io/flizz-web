import { ProjectShift } from '@/components/features/portfolio/project-shift';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import type { ProjectQuote, ProjectResult } from '@/types/portfolio';
import { cn } from '@workspace/ui/lib/utils';

interface ProjectOutcomeProps {
	results: ProjectResult[];
	quote?: ProjectQuote;
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The payoff. The index row only shows the first of these, so arriving here
 * with the other two still unspent is the point of the page.
 *
 * Each figure keeps the pair it was measured against — a number on its own is
 * a claim, and a portfolio full of claims is worth nothing to somebody deciding
 * whether to call us.
 */
export function ProjectOutcome({
	results,
	quote,
	sectionIndex,
	totalSections,
	className
}: ProjectOutcomeProps) {
	if (!results.length) return null;

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
						label="The outcome"
					/>
					<h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
						What changed
					</h2>
				</Reveal>

				<div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0">
					{results.map((result, index) => (
						<Reveal
							key={result.label}
							delay={index * 80}
							className={cn(
								'lg:px-10 lg:first:pl-0 lg:last:pr-0',
								// The rules divide the figures rather than box
								// them: three cards here would read as a stats
								// band, which is a different, weaker claim.
								index > 0 && 'lg:border-l lg:border-border'
							)}
						>
							<ProjectShift
								result={result}
								size="lg"
							/>
						</Reveal>
					))}
				</div>

				{quote ? (
					<Reveal
						delay={160}
						className="mt-16 border-t border-border pt-10"
					>
						<figure className="max-w-3xl">
							<blockquote className="font-serif text-2xl leading-snug text-pretty text-foreground italic sm:text-3xl">
								{quote.text}
							</blockquote>
							<figcaption className="mt-6 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
								{quote.attribution}
							</figcaption>
						</figure>
					</Reveal>
				) : null}
			</div>
		</section>
	);
}
