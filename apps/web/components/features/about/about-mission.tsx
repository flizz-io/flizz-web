import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { aboutMission, aboutMissionSupport } from '@/constants/about';
import { cn } from '@workspace/ui/lib/utils';

interface AboutMissionProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * One sentence, given a whole section. The mission is the page's thesis and
 * the only place a serif this large appears — everything after it is evidence,
 * so this is the last moment the page gets to simply assert something.
 */
export function AboutMission({
	sectionIndex,
	totalSections,
	className
}: AboutMissionProps) {
	return (
		<section
			className={cn(
				'border-t border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Our Mission"
					/>
				</Reveal>

				<Reveal delay={100}>
					<p className="mt-10 max-w-4xl font-serif text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.12] text-balance text-foreground">
						{aboutMission}
					</p>
				</Reveal>

				<Reveal
					delay={180}
					className="mt-10 max-w-xl border-l border-primary/40 pl-6"
				>
					<p className="text-base text-pretty text-muted-foreground">
						{aboutMissionSupport}
					</p>
				</Reveal>
			</div>
		</section>
	);
}
