import { Check } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { riskReversals } from '@/constants/home';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface FinalCtaProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

export function FinalCta({
	sectionIndex,
	totalSections,
	className
}: FinalCtaProps) {
	return (
		<section
			className={cn(
				'relative isolate flex min-h-[80svh] items-center overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8',
				className
			)}
		>
			{/* Light gathering low in the frame, under where the action sits. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
				style={{
					background:
						'radial-gradient(ellipse 60% 100% at 50% 100%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 72%)'
				}}
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.05]"
				style={{
					backgroundImage:
						'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
					backgroundSize: '22px 22px',
					maskImage:
						'radial-gradient(ellipse 70% 70% at 50% 50%, #000, transparent 75%)',
					WebkitMaskImage:
						'radial-gradient(ellipse 70% 70% at 50% 50%, #000, transparent 75%)'
				}}
			/>

			<div className="relative mx-auto w-full max-w-3xl text-center">
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="Let's Talk"
					title={
						<>
							Let&apos;s Build technology that <br />
							<span className="font-serif leading-1.5 tracking-wide text-primary italic">
								works for your business
							</span>
						</>
					}
					description="Whether you're launching something new, scaling what's working, or fixing what's broken — let's talk about how we can help you get there."
					align="center"
					titleClassName="text-4xl sm:text-5xl lg:text-6xl"
					descriptionClassName="mx-auto max-w-xl"
				/>

				{/* The button sits on the horizon, and the horizon draws outward
				    from it — so the whole frame reads as radiating from the one
				    action the page has been building toward. */}
				<Reveal
					delay={140}
					className="relative mt-14 flex items-center justify-center"
				>
					<span
						aria-hidden
						className="pointer-events-none absolute inset-x-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-transform duration-[1600ms] ease-power-on group-data-[revealed=true]/reveal:scale-x-100"
					/>
					<span
						aria-hidden
						className="pointer-events-none absolute size-56 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-[1600ms] group-data-[revealed=true]/reveal:opacity-100"
					/>
					<Button
						asChild
						size="lg"
						className="relative h-12 px-7 text-base shadow-[0_0_40px_-12px_var(--color-primary)]"
					>
						<Link href="/contact">Schedule a Discovery Call →</Link>
					</Button>
				</Reveal>

				<Reveal
					delay={220}
					className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8"
				>
					{riskReversals.map((risk) => (
						<span
							key={risk.text}
							className="flex items-start gap-2 text-sm text-balance text-muted-foreground"
						>
							<Check className="mt-0.5 size-4 shrink-0 text-primary" />
							{risk.text}
						</span>
					))}
				</Reveal>
			</div>
		</section>
	);
}
