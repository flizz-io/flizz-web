import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { contactNextSteps } from '@/constants/contact';
import { cn } from '@workspace/ui/lib/utils';

interface ContactNextStepsProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The one place on the page where numbering is load-bearing: each step only
 * happens once the one before it has, and the rail behind the markers draws
 * left to right as the section arrives to say so.
 */
export function ContactNextSteps({
	sectionIndex,
	totalSections,
	className
}: ContactNextStepsProps) {
	return (
		<section
			className={cn(
				// No top border: the form section above closes with its own.
				'px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="After you send"
					title="What happens next"
					description="Three steps, and you can stop after any of them."
				/>

				<Reveal
					delay={80}
					className="relative mt-14"
				>
					{/* Runs behind the markers and stops short of the last one,
					    so the sequence reads as open rather than closed. */}
					<span
						aria-hidden
						className="pointer-events-none absolute inset-x-0 top-3 hidden h-px origin-left scale-x-0 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent transition-transform duration-[1600ms] ease-power-on group-data-[revealed=true]/reveal:scale-x-100 lg:block"
					/>

					<ol className="grid gap-12 lg:grid-cols-3 lg:gap-14">
						{contactNextSteps.map((step, index) => (
							<li
								key={step.title}
								className="relative"
							>
								<div className="flex items-center gap-3">
									<span className="relative z-10 flex size-6 shrink-0 items-center justify-center border border-primary/40 bg-background font-mono text-[0.6rem] text-primary">
										{String(index + 1).padStart(2, '0')}
									</span>
									<span className="bg-background pr-2 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
										{step.duration}
									</span>
								</div>

								<h3 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground">
									{step.title}
								</h3>
								<p className="mt-3 max-w-sm text-base text-pretty text-muted-foreground">
									{step.description}
								</p>
							</li>
						))}
					</ol>
				</Reveal>
			</div>
		</section>
	);
}
