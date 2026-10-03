import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import type { ServiceFaq } from '@/types/services';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceFaqsProps {
	faqs: ServiceFaq[];
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * Questions about this one service, every answer open. Not the home page's
 * accordion: these answers are read by search engines and AI assistants,
 * which don't click to expand, so nothing here waits behind a toggle. The
 * question sits beside its answer like a ledger rather than above it.
 */
export function ServiceFaqs({
	faqs,
	sectionIndex,
	totalSections,
	className
}: ServiceFaqsProps) {
	return (
		<section
			className={cn('px-4 py-20 sm:px-6 sm:py-28 lg:px-8', className)}
		>
			<div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-20">
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="Questions"
					title="What people ask first"
				/>

				<Reveal delay={100}>
					<dl className="border-t border-border">
						{faqs.map((faq) => (
							<div
								key={faq.question}
								className="grid gap-3 border-b border-border py-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10"
							>
								<dt className="font-heading text-lg font-semibold tracking-tight text-balance text-foreground">
									{faq.question}
								</dt>
								<dd className="max-w-prose text-base text-pretty text-muted-foreground">
									{faq.answer}
								</dd>
							</div>
						))}
					</dl>
				</Reveal>
			</div>
		</section>
	);
}
