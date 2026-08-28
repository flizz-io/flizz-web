import Link from 'next/link';

import { AudienceWall } from '@/components/features/home/audience-wall';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface WhoWeBuildForProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

export function WhoWeBuildFor({
	sectionIndex,
	totalSections,
	className
}: WhoWeBuildForProps) {
	return (
		<section
			className={cn(
				'relative isolate flex min-h-[85svh] items-center overflow-hidden border-y border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8',
				className
			)}
		>
			<AudienceWall />

			{/* Calms the middle of the wall without erasing it — the segments
			    should still read behind the statement, the way they do on the
			    reference; only the smaller body copy needs the bed. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 52% 42% at 50% 52%, color-mix(in oklab, var(--color-background) 74%, transparent) 0%, transparent 78%)'
				}}
			/>

			<div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Who we build for"
					/>
				</Reveal>

				<Reveal
					delay={90}
					className="mt-6"
				>
					{/* TODO: PM to confirm this headline — no audience copy was
					    supplied in the requirements sheet. */}
					<h2 className="font-serif text-4xl leading-[1.05] text-balance text-foreground sm:text-5xl lg:text-6xl">
						When your process is the advantage,{' '}
						<span className="text-primary italic">
							the software has to protect it
						</span>
						.
					</h2>
				</Reveal>

				<Reveal
					delay={180}
					className="mt-6 max-w-xl"
				>
					<p className="text-base text-pretty text-muted-foreground sm:text-lg">
						SaaS and product teams, e-commerce operators,
						operations-heavy businesses, and founders shipping a
						first version — work where the requirements are
						specific, the timeline is real, and the code has to stay
						yours.
					</p>
				</Reveal>

				<Reveal
					delay={270}
					className="mt-9"
				>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="h-11 rounded-full border-primary/50 px-6 text-base hover:border-primary hover:bg-primary/10"
					>
						<Link href="/contact">See if we&apos;re a fit →</Link>
					</Button>
				</Reveal>
			</div>
		</section>
	);
}
