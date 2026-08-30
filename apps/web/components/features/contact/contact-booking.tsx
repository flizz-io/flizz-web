import { ArrowUp, Check } from 'lucide-react';

import { EmptyState } from '@/components/snippets/empty-state/empty-state';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { ScrollLink } from '@/components/snippets/scroll-link/scroll-link';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { siteConfig } from '@/configs/site';
import {
	contactBookingPoints,
	contactBookingSlotLabel,
	contactFormAnchorId
} from '@/constants/contact';
import { cn } from '@workspace/ui/lib/utils';

interface ContactBookingProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The faster path, for people who would rather talk than write. The slot holds
 * the scheduler once one is chosen — until then it says so plainly rather than
 * standing in with a fake calendar.
 */
export function ContactBooking({
	sectionIndex,
	totalSections,
	className
}: ContactBookingProps) {
	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Book it directly"
					/>
					<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
						Rather just talk?
					</h2>
					<p className="mt-4 max-w-md text-base text-pretty text-muted-foreground">
						Skip the writing and take a slot. You do not need
						anything prepared — the call works fine as the first
						time you say the problem out loud.
					</p>

					<ul className="mt-8 space-y-3">
						{contactBookingPoints.map((point) => (
							<li
								key={point}
								className="flex items-start gap-2.5 text-sm text-muted-foreground"
							>
								<Check className="mt-0.5 size-4 shrink-0 text-primary" />
								{point}
							</li>
						))}
					</ul>

					<ScrollLink
						targetId={contactFormAnchorId}
						className="group mt-9 inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-primary"
					>
						<ArrowUp className="size-3.5 text-primary transition-transform group-hover:-translate-y-0.5" />
						Or write a brief instead
					</ScrollLink>
				</Reveal>

				<Reveal delay={80}>
					<EmptyState
						className="min-h-72 justify-center bg-card/40 backdrop-blur-sm"
						title={contactBookingSlotLabel}
						description="The scheduler is not wired up yet. Email us and we will send times back the same day."
						linkLabel={siteConfig.contactEmail}
						linkHref={`mailto:${siteConfig.contactEmail}`}
					/>
				</Reveal>
			</div>
		</section>
	);
}
