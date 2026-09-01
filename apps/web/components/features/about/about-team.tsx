import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { aboutTeam } from '@/constants/about';
import type { TeamMemberLinks } from '@/types/about';
import { cn } from '@workspace/ui/lib/utils';

import { TeamPortrait } from './team-portrait';

interface AboutTeamProps {
	sectionIndex: number;
	totalSections?: number;
	/**
	 * Switches the whole section off. The roster is placeholder content until
	 * the real team is confirmed, so the page can ship without it rather than
	 * carrying commented-out markup.
	 */
	isVisible?: boolean;
	className?: string;
}

const linkLabels: Array<{ key: keyof TeamMemberLinks; label: string }> = [
	{ key: 'linkedin', label: 'LinkedIn' },
	{ key: 'x', label: 'X' },
	{ key: 'portfolio', label: 'Portfolio' }
];

/**
 * One frame, divided — not seven cards on a grid. The company is small enough
 * to fit in a single shot, which is what the section says, so the slats sit
 * edge to edge inside one border and share it.
 *
 * Opening a slat is pure CSS: `flex-grow` on hover, and on `:focus-within` so
 * the keyboard reaches the same state. No client JavaScript, and the section
 * stays server-rendered. Below `lg` the frame becomes a plain stack with every
 * detail already visible, since there is no hover to open anything with.
 */
export function AboutTeam({
	sectionIndex,
	totalSections,
	isVisible = true,
	className
}: AboutTeamProps) {
	if (!isVisible) return null;

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="Who you work with"
					title="Seven people, one frame"
					description="Small enough that the person who scoped your project is the one who builds it."
				/>

				<Reveal
					delay={80}
					className="mt-14"
				>
					<ul className="grid gap-4 sm:grid-cols-2 lg:flex lg:h-[34rem] lg:gap-0 lg:overflow-hidden lg:rounded-xl lg:border lg:border-border">
						{aboutTeam.map((member) => (
							<li
								key={member.name}
								className={cn(
									'group/slat relative isolate aspect-4/5 overflow-hidden rounded-lg border border-border',
									// Inside the shared frame the slats keep only
									// the hairline between them.
									'lg:aspect-auto lg:flex-1 lg:rounded-none lg:border-0 lg:border-r lg:last:border-r-0',
									// Arbitrary property rather than `flex-[2.6]`,
									// which Tailwind does not emit a rule for.
									'lg:focus-within:[flex-grow:2.6] lg:hover:[flex-grow:2.6]',
									'motion-safe:lg:transition-[flex-grow] motion-safe:lg:duration-700 motion-safe:lg:ease-power-on'
								)}
							>
								<TeamPortrait
									name={member.name}
									photo={member.photo}
								/>

								{/* Keeps the name legible over any photograph. */}
								<span
									aria-hidden
									className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/70 to-transparent"
								/>

								{member.isFounder ? (
									<span className="absolute top-4 left-4 font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
										Founder
									</span>
								) : null}

								<div className="absolute inset-x-0 bottom-0 p-5">
									{/* Fixed two-line box on the frame, so a name
									    that wraps and one that does not still
									    share a baseline across the slats. */}
									<h3 className="font-heading text-base font-semibold tracking-tight text-balance text-foreground lg:flex lg:h-12 lg:items-end">
										{member.name}
									</h3>

									{/* Held back until the slat opens, so a closed
									    one carries the name and nothing else. */}
									<div
										className={cn(
											'grid',
											// Collapsed to zero height rather than
											// merely hidden: a closed slat gives
											// this block no space at all, so every
											// name lands on the same baseline
											// however long the role runs.
											'lg:[grid-template-rows:0fr] lg:opacity-0',
											'lg:group-hover/slat:[grid-template-rows:1fr] lg:group-hover/slat:opacity-100',
											'lg:group-focus-within/slat:[grid-template-rows:1fr] lg:group-focus-within/slat:opacity-100',
											'motion-safe:lg:transition-[grid-template-rows,opacity] motion-safe:lg:duration-500 motion-safe:lg:ease-power-on'
										)}
									>
										<div className="overflow-hidden">
											<p className="mt-2 font-mono text-[0.65rem] tracking-[0.18em] text-primary uppercase">
												{member.role}
											</p>

											<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
												{linkLabels.map(
													({ key, label }) => {
														const href =
															member.links[key];
														if (!href) return null;

														return (
															<Link
																key={key}
																href={href}
																target="_blank"
																rel="noopener noreferrer"
																className="font-mono text-[0.65rem] tracking-[0.1em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:text-foreground"
															>
																{label}
															</Link>
														);
													}
												)}
											</div>
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
