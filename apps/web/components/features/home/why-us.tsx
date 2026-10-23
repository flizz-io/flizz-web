import { WhyUsBrace } from '@/components/features/home/why-us-brace';
import { WhyUsScroll } from '@/components/features/home/why-us-scroll';
import type { WhyUsVariation, WhyUsVariationProps } from '@/types/home';

interface WhyUsProps extends WhyUsVariationProps {
	/**
	 * Which Why Flizzio to render (see `WhyUsVariation`). Each variation is
	 * self-contained; this only picks, so swapping is a prop change.
	 */
	variation?: WhyUsVariation;
	/** `scroll` only — show every description at once, not just the active one. */
	showAllDescriptions?: boolean;
}

export function WhyUs({
	variation = 'brace',
	showAllDescriptions,
	...props
}: WhyUsProps) {
	if (variation === 'scroll') {
		return (
			<WhyUsScroll
				showAllDescriptions={showAllDescriptions}
				{...props}
			/>
		);
	}

	return <WhyUsBrace {...props} />;
}
