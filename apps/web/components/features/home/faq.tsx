import { Reveal } from '@/components/snippets/reveal/reveal';
import { faqItems } from '@/constants/home';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@workspace/ui/components/accordion';

export function Faq() {
	return (
		<section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
			<Reveal className="text-center">
				<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
					FAQs
				</p>
				<h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
					Questions, answered
				</h2>
			</Reveal>

			<Reveal
				delay={80}
				className="mt-12"
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
							<AccordionTrigger className="font-heading text-base font-semibold tracking-tight text-foreground">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</Reveal>
		</section>
	);
}
