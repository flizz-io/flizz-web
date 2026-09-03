'use client';

import { useCallback, useState } from 'react';

import { ProjectShift } from '@/components/features/portfolio/project-shift';
import {
	IndexedList,
	IndexedListItem
} from '@/components/snippets/indexed-list/indexed-list';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { archivePageSize, archiveProjects } from '@/constants/portfolio';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface PortfolioArchiveProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * Everything the reel does not carry.
 *
 * The reel gives four projects a screen each, which is the right treatment for
 * work we lead with and the wrong one for the rest — nobody wants to scroll
 * through ten full-height frames to find the one that matches their situation.
 * So the remainder lands here in the site's own row idiom, a page at a time.
 *
 * Rows arrive in batches rather than all at once for the same reason the reel
 * exists: an index that opens at its full length reads as a backlog. Paging is
 * client-side over a static roster today, and the shape is what the Projects
 * API will page against at Stage 13.
 */
export function PortfolioArchive({
	sectionIndex,
	totalSections,
	className
}: PortfolioArchiveProps) {
	const [visibleCount, setVisibleCount] = useState(archivePageSize);

	const loadMore = useCallback(
		() => setVisibleCount((current) => current + archivePageSize),
		[]
	);

	if (!archiveProjects.length) return null;

	const visible = archiveProjects.slice(0, visibleCount);
	const remaining = archiveProjects.length - visible.length;

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<SectionTag
							index={sectionIndex}
							total={totalSections}
							label="The index"
						/>
						<h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
							The rest of the work
						</h2>
					</div>

					<p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
						Showing
						<span className="mx-2 text-foreground">
							{String(visible.length).padStart(2, '0')}
						</span>
						of {String(archiveProjects.length).padStart(2, '0')}
					</p>
				</Reveal>

				<IndexedList className="mt-12">
					{visible.map((project, index) => (
						<IndexedListItem
							key={project.slug}
							index={index}
							eyebrow={project.sector}
							title={project.name}
							description={project.summary}
							// Fixed widths on both right-hand columns: left to
							// size themselves, every row starts its summary and
							// its result at a different x and the index reads as
							// ragged rather than tabular.
							descriptionClassName="sm:w-56 lg:w-64"
							href={`/portfolio/${project.slug}`}
							// Staggered within its own batch, so a press of the
							// button lands as one movement rather than a queue.
							revealDelay={(index % archivePageSize) * 70}
							meta={
								project.results[0] ? (
									<ProjectShift
										result={project.results[0]}
										className="hidden shrink-0 md:block lg:w-64"
									/>
								) : null
							}
						/>
					))}
				</IndexedList>

				{remaining > 0 ? (
					<Reveal className="mt-12 flex justify-center">
						<Button
							type="button"
							variant="outline"
							size="lg"
							onClick={loadMore}
							className="h-11 px-7"
						>
							Load more
						</Button>
					</Reveal>
				) : null}
			</div>
		</section>
	);
}
