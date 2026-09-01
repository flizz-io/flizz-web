import Image from 'next/image';

import { DotField } from '@/components/snippets/dot-field/dot-field';
import { getInitials } from '@/utils/team';
import { cn } from '@workspace/ui/lib/utils';

interface TeamPortraitProps {
	name: string;
	/** When absent, the frame shows an initials plate instead. */
	photo?: string;
	className?: string;
}

/**
 * The photograph slot. Real portraits drop straight in as `photo`; until then
 * each frame holds an initials plate rather than a stock face or an empty
 * grey box — honest about being unfilled without looking broken.
 */
export function TeamPortrait({ name, photo, className }: TeamPortraitProps) {
	if (photo) {
		return (
			<Image
				src={photo}
				alt={name}
				fill
				// The frame caps at max-w-7xl, so an open slat never exceeds
				// ~400px however wide the viewport gets.
				sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
				className={cn(
					// Biased above centre: the only vertical crop happens on
					// the mobile 4:5 card, and it should take it off the chin
					// rather than the top of the head.
					'object-cover [object-position:50%_35%]',
					'transition-transform duration-700 ease-power-on group-hover/slat:scale-[1.03]',
					className
				)}
			/>
		);
	}

	return (
		<span
			aria-hidden
			className={cn(
				'absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-b from-muted/60 to-muted/20',
				className
			)}
		>
			<DotField
				spacing={18}
				masked={false}
				className="opacity-[0.05]"
			/>
			<span className="relative font-heading text-5xl font-semibold tracking-tight text-foreground/20 transition-colors duration-700 group-hover/slat:text-foreground/30">
				{getInitials(name)}
			</span>
		</span>
	);
}
