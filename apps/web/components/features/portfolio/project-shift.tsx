import type { ProjectResult } from '@/types/portfolio';
import { cn } from '@workspace/ui/lib/utils';

interface ProjectShiftProps {
	result: ProjectResult;
	/** `lg` gives the landing value display size, for the results section. */
	size?: 'sm' | 'lg';
	align?: 'left' | 'right';
	className?: string;
}

/**
 * One measured change, stated as the pair it actually is.
 *
 * A single figure claims nothing a visitor can check — "four hours" only means
 * something beside the six days it replaced. Both values are set in the serif,
 * and only the colour separates them, so the pair reads as one sentence rather
 * than as a statistic in a box.
 */
export function ProjectShift({
	result,
	size = 'sm',
	align = 'left',
	className
}: ProjectShiftProps) {
	return (
		<div
			className={cn(
				align === 'right' ? 'sm:text-right' : undefined,
				className
			)}
		>
			<p className="font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
				{result.label}
			</p>

			<p
				className={cn(
					'mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1',
					align === 'right' ? 'sm:justify-end' : undefined
				)}
			>
				<span className="font-serif text-base text-muted-foreground italic">
					<span className="sr-only">From </span>
					{result.from}
				</span>

				<span
					aria-hidden
					className="h-px w-5 shrink-0 translate-y-[-0.3em] bg-border"
				/>

				<span
					className={cn(
						'font-serif text-primary',
						size === 'lg'
							? 'text-2xl sm:text-3xl'
							: 'text-xl sm:text-2xl'
					)}
				>
					<span className="sr-only">to </span>
					{result.to}
				</span>
			</p>
		</div>
	);
}
