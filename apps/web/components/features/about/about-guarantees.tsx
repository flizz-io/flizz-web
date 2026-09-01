import { Reveal } from '@/components/snippets/reveal/reveal';
import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { aboutGuarantees } from '@/constants/about';
import { cn } from '@workspace/ui/lib/utils';

interface AboutGuaranteesProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The values are what we believe; this is what we can be held to. It is set as
 * a spec sheet rather than prose on purpose — these are terms, and terms
 * should look checkable.
 */
export function AboutGuarantees({
	sectionIndex,
	totalSections,
	className
}: AboutGuaranteesProps) {
	return (
		<section
			className={cn(
				'border-t border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8',
				className
			)}
		>
			<div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="What we guarantee"
					/>
					<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
						The terms, before you ask for them
					</h2>
					<p className="mt-6 max-w-md text-base text-pretty text-muted-foreground">
						None of this is negotiated late or buried in an
						appendix. It is how every engagement runs.
					</p>
				</Reveal>

				<Reveal delay={120}>
					<SchematicFrame className="border border-border bg-card/50">
						<div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-7">
							<span className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
								Standard terms
							</span>
							<span className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">
								Every project
							</span>
						</div>

						<dl className="divide-y divide-border">
							{aboutGuarantees.map((guarantee) => (
								<div
									key={guarantee.term}
									className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-7"
								>
									<dt className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
										{guarantee.term}
									</dt>
									<dd className="text-sm text-pretty text-foreground sm:text-right">
										{guarantee.value}
									</dd>
								</div>
							))}
						</dl>
					</SchematicFrame>
				</Reveal>
			</div>
		</section>
	);
}
