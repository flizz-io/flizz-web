import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { valueProps } from '@/constants/home';
import type { WhyUsVariationProps } from '@/types/home';
import { cn } from '@workspace/ui/lib/utils';

/** Each ending finishes the stem, so it starts mid-sentence and closes one. */
function endingOf(title: string) {
	return `${title.charAt(0).toLowerCase()}${title.slice(1)}.`;
}

/**
 * The scroll variation spends six screens lighting one clause at a time, which
 * is a lot of page for the least specific copy on it. Here the stem and all six
 * endings sit on one screen instead, drawn as a single bracket: one line leaves
 * the stem, meets a spine, and fans out to every ending at once. The shape is
 * the argument — six ways of finishing one sentence, read in a glance rather
 * than scrolled through — so the section costs a screen and reads as a
 * statement instead of an interlude.
 *
 * No numbering: the endings are parallel claims, not steps, and numbering them
 * promises a sequence that isn't there. Nothing here needs the client, either.
 */
export function WhyUsBrace({
	sectionIndex,
	totalSections,
	className
}: WhyUsVariationProps) {
	return (
		<section
			data-section-reveal
			className={cn(
				'border-b border-border px-4 py-20 sm:px-6 sm:py-28 lg:flex lg:min-h-svh lg:items-center lg:px-8',
				className
			)}
		>
			<div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-center lg:gap-0 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
				{/* Centred against the branches rather than topped with them,
				    so the connector leaves the stem at its middle and the fan
				    is symmetrical about the sentence it comes from. */}
				<div className="relative lg:pr-14">
					<SectionHeader
						index={sectionIndex}
						total={totalSections}
						eyebrow="Why Flizzio"
						title="We build solutions that"
					/>

					<span
						aria-hidden
						className="absolute top-1/2 right-0 hidden h-px w-14 bg-border lg:block"
					/>
				</div>

				<Reveal>
					<ul className="relative flex flex-col gap-6 pl-6 lg:gap-9 lg:pl-14">
						{/* The spine, drawn downwards once the list arrives —
						    the section's one piece of motion, and the moment
						    the six endings become one bracket. */}
						<span
							aria-hidden
							className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-border transition-transform duration-[900ms] ease-power-on group-data-[revealed=true]/reveal:scale-y-100 motion-reduce:transition-none"
						/>

						{valueProps.map((value) => (
							// One row per branch on large screens — the gloss
							// sits beside the ending rather than under it, so
							// the bracket spans the measure and the whole fan
							// stays short enough to take in at once.
							<li
								key={value.title}
								className="group/branch relative lg:grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-baseline lg:gap-x-10"
							>
								{/* Meets the ending at its first line, not at
								    the middle of the whole row, so the branch
								    points at the clause and not at its gloss. */}
								<span
									aria-hidden
									className="absolute top-[0.7em] -left-6 h-px w-6 bg-border transition-colors duration-300 group-hover/branch:bg-primary lg:-left-14 lg:w-14"
								/>

								<p className="font-serif text-2xl leading-snug text-foreground lg:text-[1.75rem]">
									{endingOf(value.title)}
								</p>
								<p className="mt-1.5 max-w-[46ch] text-sm text-muted-foreground lg:mt-0">
									{value.description}
								</p>
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
