import { ArrowUp } from 'lucide-react';

import { OpenIndicator } from '@/components/snippets/open-indicator/open-indicator';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { ScrollLink } from '@/components/snippets/scroll-link/scroll-link';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { contactFaqItems, contactFormAnchorId } from '@/constants/contact';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@workspace/ui/components/accordion';
import { cn } from '@workspace/ui/lib/utils';

interface ContactFaqProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * Only the questions that come up before someone writes in — the ones about
 * the work itself live on the home page.
 */
export function ContactFaq({
	sectionIndex,
	totalSections,
	className
}: ContactFaqProps) {
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
					label="Before you write"
				/>
				<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
					What people ask first
				</h2>
				<p className="mt-4 max-w-xl text-base text-muted-foreground">
					Everything else is fair game on the call.
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
					{contactFaqItems.map((item, index) => (
						<AccordionItem
							key={item.question}
							value={item.question}
						>
							<AccordionTrigger className="items-start gap-5 py-6 hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
								<span className="mt-1.5 font-mono text-xs text-muted-foreground transition-colors group-aria-expanded/accordion-trigger:text-primary">
									{String(index + 1).padStart(2, '0')}
								</span>
								<span className="flex-1 font-heading text-lg font-semibold tracking-tight text-balance text-foreground transition-colors group-aria-expanded/accordion-trigger:text-primary sm:text-xl">
									{item.question}
								</span>
								<OpenIndicator />
							</AccordionTrigger>

							<AccordionContent className="pr-9 pb-6 pl-11 text-base text-pretty text-muted-foreground">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				{/* Reads as the list's last row: the way out when none of the
				    answers above is the one you needed. */}
				<ScrollLink
					targetId={contactFormAnchorId}
					className="group flex items-center justify-between gap-5 border-b border-border py-6 transition-colors hover:border-primary/50"
				>
					<span className="flex items-baseline gap-5">
						<span className="font-mono text-xs text-primary">
							&mdash;
						</span>
						<span className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
							Something else on your mind?
						</span>
					</span>
					<span className="flex shrink-0 items-center gap-2 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase transition-colors group-hover:text-primary">
						Ask it above
						<ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" />
					</span>
				</ScrollLink>
			</Reveal>
		</section>
	);
}
