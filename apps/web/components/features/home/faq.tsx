import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { faqItems } from '@/constants/home';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@workspace/ui/components/accordion';
import { cn } from '@workspace/ui/lib/utils';

/**
 * A plus that loses its upright stroke on open, in place of the default
 * chevron swap — a quieter, more mechanical tell that matches the schematic
 * language used across the page.
 */
function OpenIndicator() {
	return (
		<span
			aria-hidden
			className="relative mt-1.5 ml-6 size-3.5 shrink-0"
		>
			<span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-muted-foreground transition-colors duration-300 group-aria-expanded/accordion-trigger:bg-primary" />
			<span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-muted-foreground transition-transform duration-300 ease-power-on group-aria-expanded/accordion-trigger:scale-y-0" />
		</span>
	);
}

interface FaqProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

export function Faq({ sectionIndex, totalSections, className }: FaqProps) {
	return (
		<section
			className={cn(
				'mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<Reveal>
				<SectionTag
					index={sectionIndex}
					total={totalSections}
					label="FAQs"
				/>
				<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
					Questions, answered
				</h2>
				<p className="mt-4 max-w-xl text-base text-muted-foreground">
					The things people ask before we start working together.
				</p>
			</Reveal>

			<Reveal
				delay={80}
				className="mt-14"
			>
				<Accordion
					type="single"
					collapsible
					className="border-t border-border"
				>
					{faqItems.map((item, index) => (
						<AccordionItem
							key={item.question}
							value={item.question}
						>
							<AccordionTrigger
								// The packaged chevrons are hidden in favour of
								// the indicator below, and the underline with
								// them — it fights type this size.
								className="items-start gap-5 py-6 hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden"
							>
								<span className="mt-1.5 font-mono text-xs text-muted-foreground transition-colors group-aria-expanded/accordion-trigger:text-primary">
									{String(index + 1).padStart(2, '0')}
								</span>
								<span className="flex-1 font-heading text-lg font-semibold tracking-tight text-balance text-foreground transition-colors group-aria-expanded/accordion-trigger:text-primary sm:text-xl">
									{item.question}
								</span>
								<OpenIndicator />
							</AccordionTrigger>

							{/* Indented past the index so the answer hangs off
							    its question rather than the row edge. */}
							<AccordionContent className="pr-9 pb-6 pl-11 text-base text-pretty text-muted-foreground">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				{/* Reads as the list's last row: the way out when none of the
				    answers above is the one you needed. */}
				<Link
					href="/contact"
					className="group flex items-center justify-between gap-5 border-b border-border py-6 transition-colors hover:border-primary/50"
				>
					<span className="flex items-baseline gap-5">
						<span className="font-mono text-xs text-primary">
							&mdash;
						</span>
						<span className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
							Still have a question?
						</span>
					</span>
					<span className="flex shrink-0 items-center gap-2 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase transition-colors group-hover:text-primary">
						Talk to us
						<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</span>
				</Link>
			</Reveal>
		</section>
	);
}
