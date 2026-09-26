'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { ScrollDirection } from '@/enums/scroll';
import { cn } from '@workspace/ui/lib/utils';

interface SpineArrowProps {
	direction: ScrollDirection;
	/** How many items wait out of view on this side; hidden at zero. */
	count: number;
	label: string;
	ariaLabel: string;
	onClick: () => void;
}

/**
 * An edge marker that sits on the services spine: a beam of light running
 * into a ringed arrow, with a mono count of what lies beyond. Fades and
 * slides out once that side has nothing left to show.
 */
export function SpineArrow({
	direction,
	count,
	label,
	ariaLabel,
	onClick
}: SpineArrowProps) {
	const isNext = direction === ScrollDirection.NEXT;
	const visible = count > 0;
	const Icon = isNext ? ArrowRight : ArrowLeft;

	return (
		<div
			aria-hidden={!visible}
			className={cn(
				'pointer-events-none absolute top-1/2 z-30 hidden -translate-y-1/2 items-center transition-[opacity,translate] duration-700 ease-power-on lg:flex',
				isNext ? 'right-6 flex-row' : 'left-6 flex-row-reverse',
				visible
					? 'translate-x-0 opacity-100'
					: cn(
							'opacity-0',
							isNext ? 'translate-x-4' : '-translate-x-4'
						)
			)}
		>
			{/* The spine brightening as it runs toward the arrow, so the
			    line itself reads as carrying on past the edge. */}
			<span
				className={cn(
					'h-px w-28 from-transparent to-primary',
					isNext ? 'bg-linear-to-r' : 'bg-linear-to-l'
				)}
			/>

			<button
				type="button"
				tabIndex={visible ? 0 : -1}
				aria-label={ariaLabel}
				onClick={onClick}
				className={cn(
					'group relative flex size-14 items-center justify-center rounded-full border border-primary/50 bg-background/85 text-foreground backdrop-blur-sm transition-colors duration-500 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
					visible && 'pointer-events-auto'
				)}
			>
				{/* Slow sonar ring — enough motion to catch the eye at the
				    edge without competing with the specimens. */}
				<span className="absolute inset-0 animate-ping rounded-full border border-primary/40 [animation-duration:2.6s] motion-reduce:animate-none" />
				<Icon
					className={cn(
						'size-5 transition-transform duration-500 ease-power-on',
						isNext
							? 'group-hover:translate-x-0.5'
							: 'group-hover:-translate-x-0.5'
					)}
				/>

				<span
					className={cn(
						'absolute -top-7 font-mono text-[11px] tracking-[0.3em] whitespace-nowrap text-primary uppercase',
						isNext ? 'right-0' : 'left-0'
					)}
				>
					{`${String(count).padStart(2, '0')} ${label}`}
				</span>
			</button>
		</div>
	);
}
