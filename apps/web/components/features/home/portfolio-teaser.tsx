import Link from 'next/link';

import { ProjectStrip } from '@/components/features/home/project-strip';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { portfolioMeta } from '@/constants/home';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface PortfolioTeaserProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

export function PortfolioTeaser({
	sectionIndex,
	totalSections,
	className
}: PortfolioTeaserProps) {
	return (
		// Clipped rather than hidden: the strip runs to the viewport edges while
		// the header stays on the page container.
		<section
			className={cn(
				'overflow-x-clip border-t border-border py-20 sm:py-28',
				className
			)}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<Reveal className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Our Work"
					/>
					<p className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase sm:text-[0.65rem]">
						{portfolioMeta}
					</p>
				</Reveal>

				<Reveal
					delay={80}
					className="mt-6"
				>
					<h2 className="max-w-3xl font-serif text-4xl leading-[1.05] text-balance text-foreground sm:text-5xl lg:text-6xl">
						Work we&apos;ve designed and built
					</h2>
				</Reveal>
			</div>

			<ProjectStrip className="mt-10" />

			<div className="mt-14 flex justify-center px-4 sm:px-6 lg:px-8">
				<Button
					asChild
					size="lg"
					className="h-11 rounded-full px-6 text-base"
				>
					<Link href="/portfolio">View all case studies →</Link>
				</Button>
			</div>
		</section>
	);
}
