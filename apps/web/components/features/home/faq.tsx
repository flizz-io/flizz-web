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
			</Reveal>

			<Reveal
				delay={80}
				className="mt-14"
			>
				<Accordion
					type="single"
					collapsible
				>
					{faqItems.map((item) => (
						<AccordionItem
							key={item.question}
							value={item.question}
						>
							<AccordionTrigger className="py-4 font-heading text-lg font-semibold tracking-tight text-foreground">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="text-base text-muted-foreground">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</Reveal>
		</section>
	);
}
