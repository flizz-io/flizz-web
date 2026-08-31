import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { servicesCtaHeading, servicesCtaLead } from '@/constants/services';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface ServicesCtaProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The list page's job is routing, and this is the exit for anyone the list did
 * not route — so it asks for the problem rather than naming a service.
 */
export function ServicesCta({
	sectionIndex,
	totalSections,
	className
}: ServicesCtaProps) {
	return (
		<section
			className={cn(
				'relative isolate overflow-hidden border-t border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8',
				className
			)}
		>
			<span
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
				style={{
					background:
						'radial-gradient(ellipse 60% 100% at 50% 100%, color-mix(in oklab, var(--color-primary) 14%, transparent), transparent 72%)'
				}}
			/>

			<div className="relative mx-auto max-w-3xl text-center">
				<Reveal>
					<div className="flex justify-center">
						<SectionTag
							index={sectionIndex}
							total={totalSections}
							label="Next"
						/>
					</div>
					<h2 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
						{servicesCtaHeading}
					</h2>
					<p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
						{servicesCtaLead}
					</p>
				</Reveal>

				<Reveal
					delay={140}
					className="relative mt-12 flex items-center justify-center"
				>
					<span
						aria-hidden
						className="pointer-events-none absolute inset-x-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-transform duration-[1600ms] ease-power-on group-data-[revealed=true]/reveal:scale-x-100"
					/>
					<Button
						asChild
						size="lg"
						className="relative h-12 px-7 text-base shadow-[0_0_40px_-12px_var(--color-primary)]"
					>
						<Link href="/contact">Describe your problem →</Link>
					</Button>
				</Reveal>
			</div>
		</section>
	);
}
