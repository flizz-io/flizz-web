import { PortfolioCarousel } from '@/components/features/portfolio/portfolio-carousel';
import { PortfolioPremiere } from '@/components/features/portfolio/portfolio-premiere';
import { PortfolioReel } from '@/components/features/portfolio/portfolio-reel';
import { PortfolioReelVariant } from '@/enums/portfolio';
import type { Project } from '@/types/portfolio';
import { reelOf } from '@/utils/portfolio';

interface PortfolioReelSectionProps {
	/** Every visible project — the featured ones are picked out here. */
	projects: Project[];
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
	projects,
	variant = PortfolioReelVariant.PREMIERE,
	fullWidth,
	fullHeight,
	...rest
}: PortfolioReelSectionProps) {
	const reel = reelOf(projects);
	if (!reel.length) return null;

	const section = { ...rest, reel };

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
