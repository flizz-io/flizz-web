import { DotField } from '@/components/snippets/dot-field/dot-field';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { aboutOperatingPrinciples } from '@/constants/about';
import { cn } from '@workspace/ui/lib/utils';

interface AboutOperatingProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * A quieter band between the two loudest sections. It uses the dot field and a
 * raised ground so it reads as a different material from the value cards above
 * — four short commitments about the working relationship, not another set of
 * claims.
 */
export function AboutOperating({
	sectionIndex,
	totalSections,
	className
}: AboutOperatingProps) {
	return (
		<section
			className={cn(
				'relative isolate overflow-hidden border-t border-border bg-muted/40 px-4 py-24 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<DotField />

			<div className="relative mx-auto max-w-7xl">
				<Reveal className="max-w-2xl">
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="How we operate"
					/>
					<h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
						What working with us actually looks like
					</h2>
				</Reveal>

				<dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
					{aboutOperatingPrinciples.map((principle, index) => (
						<Reveal
							key={principle.term}
							delay={index * 70}
							className="border-t border-border pt-5"
						>
							<dt className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">
								{principle.term}
							</dt>
							<dd className="mt-3 text-sm text-pretty text-muted-foreground">
								{principle.description}
							</dd>
						</Reveal>
					))}
				</dl>
			</div>
		</section>
	);
}
