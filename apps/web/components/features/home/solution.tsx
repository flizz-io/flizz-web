'use client';

import { motion } from 'framer-motion';

import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { processSteps } from '@/constants/home';
import { cn } from '@workspace/ui/lib/utils';

const tileVariants = [
	'bg-card border border-border text-foreground',
	'bg-[#120f1c] dark:bg-secondary text-white dark:text-secondary-foreground',
	'bg-card border border-border text-foreground',
	'bg-[#120f1c] dark:bg-secondary text-white dark:text-secondary-foreground',
	'bg-primary text-primary-foreground'
];

const mutedVariants = [
	'text-muted-foreground',
	'text-white/65 dark:text-muted-foreground',
	'text-muted-foreground',
	'text-white/65 dark:text-muted-foreground',
	'text-primary-foreground/75'
];

function ProgressGraphic({
	step,
	accentClass
}: {
	step: number;
	accentClass: string;
}) {
	return (
		<svg
			aria-hidden
			width="72"
			height="32"
			viewBox="0 0 72 32"
			className="shrink-0"
		>
			{[0, 1, 2, 3, 4].map((bar) => {
				const height = 8 + bar * 6;
				const filled = bar <= step;
				return (
					<motion.rect
						key={bar}
						x={bar * 16}
						width={10}
						height={height}
						y={32 - height}
						rx={2}
						className={
							filled ? accentClass : 'fill-current opacity-15'
						}
						initial={{ scaleY: 0 }}
						whileInView={{ scaleY: 1 }}
						viewport={{ once: true }}
						transition={{
							duration: 0.5,
							delay: bar * 0.06,
							ease: 'easeOut'
						}}
						style={{ transformOrigin: `${bar * 16 + 5}px 32px` }}
					/>
				);
			})}
		</svg>
	);
}

interface SolutionProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

export function Solution({
	className,
	sectionIndex,
	totalSections
}: SolutionProps) {
	return (
		<section
			className={cn(
				className,
				'mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8'
			)}
		>
			<div className="max-w-2xl">
				<SectionTag
					index={sectionIndex}
					total={totalSections}
					label="Our Process"
				/>
				{/* TODO: PM to confirm final headline — the sheet duplicated the Problem section's headline here */}
				<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
					How we get you there
				</h2>
			</div>

			<div className="mt-14 grid gap-4 sm:grid-cols-2">
				{processSteps.map((step, index) => {
					const isWide = index === processSteps.length - 1;
					const accentClass =
						index === processSteps.length - 1
							? 'fill-primary-foreground'
							: 'fill-primary';

					return (
						<motion.div
							key={step.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={{
								duration: 0.5,
								delay: (index % 2) * 0.1
							}}
							className={cn(
								'flex flex-col justify-between gap-8 rounded-lg p-7',
								tileVariants[index],
								isWide &&
									'sm:col-span-2 sm:flex-row sm:items-end'
							)}
						>
							<div>
								<div className="flex items-center gap-3">
									<span className="font-mono text-xs opacity-60">
										{String(index + 1).padStart(2, '0')}
									</span>
									<ProgressGraphic
										step={index}
										accentClass={accentClass}
									/>
								</div>
								<h3 className="mt-5 font-heading text-xl font-semibold tracking-tight">
									{step.title}
								</h3>
								<p
									className={cn(
										'mt-3 max-w-md text-sm',
										mutedVariants[index]
									)}
								>
									{step.description}
								</p>
							</div>
							<p className="font-mono text-xs tracking-[0.05em] opacity-80">
								What you get — {step.whatYouGet}
							</p>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
