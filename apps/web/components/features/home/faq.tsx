import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { OpenIndicator } from '@/components/snippets/open-indicator/open-indicator';
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
import { SectionHeader } from '@/components/snippets/section-header/section-header';

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
			<SectionHeader
				index={sectionIndex}
				total={totalSections}
				eyebrow="FAQs"
				title="Questions, answered"
				description="The things people ask before we start working together"
			/>

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
