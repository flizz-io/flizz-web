import { HeroCinematic } from '@/components/features/home/hero-cinematic';
import { HeroConstellation } from '@/components/features/home/hero-constellation';
import { heroCinematicConfig } from '@/constants/home';
import type { HeroFacts } from '@/types/home';

/**
 * `constellation` — copy on one side, the disciplines turning on the other.
 * `cinematic` — an intro loader, then the disciplines alone on stage, handing
 *   over to the copy as the page scrolls (tuned by `heroCinematicConfig`).
 */
export type HeroVariation = 'constellation' | 'cinematic';

interface HeroProps {
	/**
	 * Which hero to render. Each variation is a self-contained component; this
	 * only picks between them, so a page never imports one directly and
	 * swapping is a prop change rather than an import change.
	 */
	variation?: HeroVariation;
	/** The cinematic hero's "N projects shipped since …" line. */
	facts?: HeroFacts;
}

export function Hero({ variation = 'constellation', facts }: HeroProps) {
	if (variation === 'cinematic') {
		return (
			<HeroCinematic
				{...heroCinematicConfig}
				facts={facts}
			/>
		);
	}

	return <HeroConstellation />;
}
