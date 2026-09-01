import Image from 'next/image';

import { cn } from '@workspace/ui/lib/utils';

interface MediaSlotProps {
	/** When absent the slot renders as reserved rather than broken. */
	src?: string;
	/** Required whenever `src` is set — this is content, not decoration. */
	alt?: string;
	/** Small caption inside the empty state, naming what will land here. */
	label?: string;
	/** Passed to `next/image`; defaults suit a full-width content figure. */
	sizes?: string;
	priority?: boolean;
	className?: string;
}

const corners = [
	'top-3 left-3 border-t border-l',
	'top-3 right-3 border-t border-r',
	'bottom-3 left-3 border-b border-l',
	'right-3 bottom-3 border-b border-r'
];

/**
 * One image slot, filled or not. The unfilled state uses registration marks —
 * the conventions of a reserved plate — so it reads as awaiting artwork rather
 * than as a broken image, and nothing invented is ever passed off as real.
 *
 * Extracted from the project strip, which had the only copy of this treatment.
 * The parent supplies the aspect ratio; this fills it.
 */
export function MediaSlot({
	src,
	alt,
	label = 'Image pending',
	sizes = '(min-width: 768px) 42rem, 100vw',
	priority,
	className
}: MediaSlotProps) {
	if (src) {
		return (
			<Image
				src={src}
				alt={alt ?? ''}
				fill
				sizes={sizes}
				priority={priority}
				className={cn('object-cover', className)}
			/>
		);
	}

	return (
		<span
			aria-hidden
			className={cn(
				'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card',
				className
			)}
		>
			<span
				className="absolute inset-0 opacity-[0.1]"
				style={{
					backgroundImage:
						'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
					backgroundSize: '16px 16px'
				}}
			/>
			<span className="pointer-events-none absolute inset-4 border border-dashed border-border" />
			{corners.map((corner) => (
				<span
					key={corner}
					className={cn(
						'pointer-events-none absolute size-6 border-primary/50',
						corner
					)}
				/>
			))}
			<span className="pointer-events-none absolute top-1/2 left-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 bg-border" />
			<span className="pointer-events-none absolute top-1/2 left-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2 bg-border" />

			<span className="relative bg-card px-3 font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
				{label}
			</span>
		</span>
	);
}
