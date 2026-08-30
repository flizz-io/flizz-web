import { HeroConstellation } from '@/components/features/home/hero-constellation';
import { HeroStarfield } from '@/components/features/home/hero-starfield';

/**
 * `starfield` — the centred statement over a drifting starfield.
 * `constellation` — copy on one side, the disciplines turning on the other.
 */
export type HeroVariation = 'starfield' | 'constellation';

interface HeroProps {
	/**
	 * Which hero to render. Each variation is a self-contained component; this
	 * only picks between them, so a page never imports one directly and
	 * swapping is a prop change rather than an import change.
	 */
	variation?: HeroVariation;
}

export function Hero({ variation = 'constellation' }: HeroProps) {
	if (variation === 'constellation') return <HeroConstellation />;

	return <HeroStarfield />;
}
