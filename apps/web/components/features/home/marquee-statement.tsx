import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { cn } from '@workspace/ui/lib/utils';

const phrases = [
	'Transparent',
	'No Lock-In',
	'Warranty-Backed',
	'Weekly Progress',
	'Built to Evolve',
	'Yours From Day One'
];

interface MarqueeStatementProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

export function MarqueeStatement({
	sectionIndex,
	totalSections,
	className
}: MarqueeStatementProps) {
	const items = [...phrases, ...phrases];

	return (
		<section
			className={cn(
				'relative overflow-hidden border-y border-border py-20 sm:py-28',
				className
			)}
		>
			<div
				aria-hidden
				className="flex w-max animate-marquee items-center gap-10 opacity-25 select-none"
			>
				{items.map((phrase, index) => (
					<span
						key={`${phrase}-${index}`}
						className="font-heading text-6xl font-semibold whitespace-nowrap text-muted-foreground sm:text-7xl"
					>
						{phrase}
					</span>
				))}
			</div>

			<Reveal className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
				<SectionTag
					index={sectionIndex}
					total={totalSections}
					label="Who we build for"
				/>
				<p className="max-w-2xl text-center font-serif text-3xl text-balance text-foreground italic sm:text-4xl">
					When the offer is hard to explain, the system has to{' '}
					<span className="text-primary">do the proving</span>.
				</p>
			</Reveal>
		</section>
	);
}
