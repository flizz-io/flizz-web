import Link from 'next/link';

import { AudienceList } from '@/components/features/home/audience-list';
import { AudienceWall } from '@/components/features/home/audience-wall';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface WhoWeBuildForProps {
	sectionIndex: number;
	totalSections?: number;
	/** Drift rate of the word wall — 1 is the baseline, 0.5 is half speed. */
	marqueeSpeed?: number;
	className?: string;
}

export function WhoWeBuildFor({
	sectionIndex,
	totalSections,
	marqueeSpeed = 1,
	className
}: WhoWeBuildForProps) {
	return (
		<section
			className={cn(
				'relative isolate flex min-h-[70svh] items-center overflow-hidden border-y border-border px-4 py-24 sm:min-h-[85svh] sm:px-6 sm:py-32 lg:px-8',
				className
			)}
		>
			<AudienceWall speed={marqueeSpeed} />

			{/* Sinks the middle of the wall back into the page so the statement
			    sits on its own bed rather than on top of the drifting words. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 62% 54% at 50% 50%, var(--color-background) 32%, transparent 100%)'
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

				{/* The wall is decorative and hidden from assistive tech, so
				    this list is where the segments are actually stated. */}
				<AudienceList className="mt-8" />

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
