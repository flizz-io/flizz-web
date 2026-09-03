import { PortfolioCarousel } from '@/components/features/portfolio/portfolio-carousel';
import { PortfolioPremiere } from '@/components/features/portfolio/portfolio-premiere';
import { PortfolioReel } from '@/components/features/portfolio/portfolio-reel';
import { PortfolioReelVariant } from '@/enums/portfolio';

interface PortfolioReelSectionProps {
	sectionIndex: number;
	totalSections?: number;
	/**
	 * Which treatment renders. Defaults to the premiere — the letterboxed stage
	 * that plays — so a caller that just drops the section in gets the headline
	 * version without having to know the other two exist.
	 */
	variant?: PortfolioReelVariant;
	/** Premiere only — run the stage edge to edge. Default true. */
	fullWidth?: boolean;
	/** Premiere only — fill the viewport height on desktop. Default true. */
	fullHeight?: boolean;
	className?: string;
}

/**
 * One entry point for the highlighted-work section, dispatching to whichever
 * treatment `variant` names. All three are real components; this keeps the page
 * from having to import and branch across them, and gives the premiere its two
 * layout props a single, documented place to arrive.
 */
export function PortfolioReelSection({
	variant = PortfolioReelVariant.PREMIERE,
	fullWidth,
	fullHeight,
	...section
}: PortfolioReelSectionProps) {
	if (variant === PortfolioReelVariant.SCROLL) {
		return <PortfolioReel {...section} />;
	}

	if (variant === PortfolioReelVariant.CAROUSEL) {
		return <PortfolioCarousel {...section} />;
	}

	return (
		<PortfolioPremiere
			{...section}
			fullWidth={fullWidth}
			fullHeight={fullHeight}
		/>
	);
}
