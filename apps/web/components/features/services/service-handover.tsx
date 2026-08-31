import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceHandoverProps {
	deliverables: string[];
	outcomes: string[];
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * Deliverables and outcomes read as one list of good things when they are
 * stacked, so they sit side by side instead — artifacts on the left, effects on
 * the right, with the rule between them carrying the distinction. Most agency
 * pages blur exactly this line; the layout is what keeps it honest.
 */
export function ServiceHandover({
	deliverables,
	outcomes,
	sectionIndex,
	totalSections,
	className
}: ServiceHandoverProps) {
	const columns = [
		{
			label: 'What we hand over',
			note: 'Things that exist when we are done.',
			items: deliverables
		},
		{
			label: 'What changes for you',
			note: 'Why the things above were worth building.',
			items: outcomes
		}
	];

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="The handover"
					/>
				</Reveal>

				<div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-0">
					{columns.map((column, columnIndex) => (
						<Reveal
							key={column.label}
							delay={columnIndex * 90}
							className={cn(
								// The rule between the columns is the point of
								// the section, so it only appears where the two
								// actually sit side by side.
								columnIndex === 1 &&
									'lg:border-l lg:border-border lg:pl-14',
								columnIndex === 0 && 'lg:pr-14'
							)}
						>
							<h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
								{column.label}
							</h2>
							<p className="mt-2 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
								{column.note}
							</p>

							<ul className="mt-8 space-y-px">
								{column.items.map((item) => (
									<li
										key={item}
										className="border-t border-border py-4 text-base text-pretty text-foreground last:border-b"
									>
										{item}
									</li>
								))}
							</ul>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
