import {
	IndexedList,
	IndexedListItem
} from '@/components/snippets/indexed-list/indexed-list';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { serviceCards } from '@/constants/home';
import { cn } from '@workspace/ui/lib/utils';

interface ServicesTeaserProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

export function ServicesTeaser({
	className,
	sectionIndex,
	totalSections
}: ServicesTeaserProps) {
	return (
		<section
			className={cn(
				className,
				'mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8'
			)}
		>
			<SectionHeader
				index={sectionIndex}
				total={totalSections}
				eyebrow="What We Build"
				title="Services for every stage of the build"
				description="A snapshot of what we do — the full list lives on the Services page."
				seeAllLabel="View all services"
				seeAllHref="/services"
			/>

			<IndexedList className="mt-14">
				{serviceCards.map((service, index) => (
					<IndexedListItem
						key={service.title}
						index={index}
						eyebrow={service.category}
						title={service.title}
						description={service.description}
						href="/services"
						revealDelay={index * 40}
					/>
				))}
			</IndexedList>
		</section>
	);
}
