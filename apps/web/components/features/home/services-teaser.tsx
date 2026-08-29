'use client';

import { useState } from 'react';

import { ServiceSpecimen } from '@/components/features/home/service-specimen';
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
	// One shared index rather than per-card state: hovering a card has to
	// dim its siblings too, which only a common owner can coordinate.
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

			<div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
				{serviceCards.map((service, index) => (
					<ServiceSpecimen
						key={service.title}
						service={service}
						index={index}
						focused={hoveredIndex === index}
						dimmed={hoveredIndex !== null && hoveredIndex !== index}
						revealDelay={index * 60}
						onHoverChange={(hovering) =>
							setHoveredIndex((current) => {
								if (hovering) return index;
								return current === index ? null : current;
							})
						}
					/>
				))}
			</div>
		</section>
	);
}
