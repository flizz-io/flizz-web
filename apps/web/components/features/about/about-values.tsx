import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { aboutValues } from '@/constants/about';
import { cn } from '@workspace/ui/lib/utils';

interface AboutValuesProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * Values written as decisions rather than benefits — the home page already
 * lists what a client gets, so restating it here would give a returning
 * visitor nothing. Deliberately unnumbered: these are held simultaneously,
 * and 01/02/03 would imply a precedence that does not exist.
 *
 * The first two cards run wide and the last three narrow, so the set reads as
 * a considered arrangement rather than a grid of equal tiles.
 */
export function AboutValues({
	sectionIndex,
	totalSections,
	className
}: AboutValuesProps) {
	return (
		<section
			className={cn(
				'border-t border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="What we hold to"
					title="Values that drive results"
					description="Five rules we apply to your project, including the ones that cost us money."
				/>

				<div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-6">
					{aboutValues.map((value, index) => (
						<Reveal
							key={value.title}
							delay={index * 70}
							className={cn(
								'group/value flex flex-col bg-background p-8 transition-colors hover:bg-card sm:p-10',
								index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'
							)}
						>
							<h3
								className={cn(
									'font-heading font-semibold tracking-tight text-balance text-foreground',
									index < 2
										? 'text-2xl sm:text-3xl'
										: 'text-xl sm:text-2xl'
								)}
							>
								{value.title}
							</h3>

							<p className="mt-4 flex-1 text-sm text-pretty text-muted-foreground">
								{value.description}
							</p>

							<p className="mt-8 border-t border-border pt-4 font-mono text-sm tracking-[0.18em] text-balance text-muted-foreground uppercase transition-colors group-hover/value:text-primary">
								{value.impact}
							</p>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
