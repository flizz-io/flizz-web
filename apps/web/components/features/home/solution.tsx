import { SolutionCarousel } from '@/components/features/home/solution-carousel';
import { SolutionScroll } from '@/components/features/home/solution-scroll';
import type { SolutionVariation, SolutionVariationProps } from '@/types/home';
import { cn } from '@workspace/ui/lib/utils';

interface SolutionProps extends SolutionVariationProps {
	/**
	 * Which Our Process to render (see `SolutionVariation`). Each variation is
	 * self-contained; this only picks, so swapping is a prop change.
	 */
	variation?: SolutionVariation;
}

export function Solution({
	variation = 'carousel',
	className,
	...props
}: SolutionProps) {
	if (variation === 'carousel') {
		return (
			<SolutionCarousel
				className={className}
				{...props}
			/>
		);
	}

	// Both render; CSS shows exactly one. The pinned scroll version takes
	// large screens, the carousel everything else (and reduced motion) —
	// decided before paint, so nothing swaps in after hydration.
	return (
		<>
			<SolutionScroll
				className={className}
				{...props}
			/>
			<SolutionCarousel
				className={cn('lg:motion-safe:hidden', className)}
				{...props}
			/>
		</>
	);
}
