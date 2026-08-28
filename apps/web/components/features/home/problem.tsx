import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { problemItems } from '@/constants/home';
import { cn } from '@workspace/ui/lib/utils';

interface ProblemProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

export function Problem({
	className,
	sectionIndex,
	totalSections
}: ProblemProps) {
	return (
		<section className={cn(className, 'border-y border-border')}>
			<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<Reveal className="max-w-2xl">
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="The Problem"
					/>
					<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
						Is this how you&apos;re building your digital solutions?
					</h2>
					<p className="mt-4 text-base">
						Most businesses face the same frustrating choices when
						building software.
					</p>
				</Reveal>

				<div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
					{problemItems.map((item, index) => (
						<Reveal
							key={item.title}
							delay={index * 80}
							className="border-t border-primary-foreground/20 pt-6"
						>
							<span className="font-mono text-sm">
								{String(index + 1).padStart(2, '0')}
							</span>
							<h3 className="mt-4 font-heading text-xl font-semibold tracking-tight">
								{item.title}
							</h3>
							<p className="mt-3 text-sm">{item.description}</p>
						</Reveal>
					))}
				</div>

				<Reveal className="mt-16 max-w-2xl border-t border-primary-foreground/20 pt-10">
					<p className="font-mono text-xs tracking-[0.2em] uppercase">
						The Real Cost
					</p>
					<p className="mt-4 text-lg text-pretty">
						Technology that holds you back instead of moving you
						forward. Competitive advantages you can&apos;t capture.
						Growth opportunities you can&apos;t pursue. Teams
						frustrated by tools that make work harder, not easier.
					</p>
				</Reveal>
			</div>
		</section>
	);
}
