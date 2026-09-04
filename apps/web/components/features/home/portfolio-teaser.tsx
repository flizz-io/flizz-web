import Link from 'next/link';

import { ProjectStrip } from '@/components/features/home/project-strip';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { portfolioMeta } from '@/constants/portfolio';
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
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="Our Work"
					title="Work we've designed and built"
					description="A snapshot of what we do — the full list lives on the Services page."
					metaInfo={portfolioMeta}
					sectionTagWrapperClassName="w-full"
				/>
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
