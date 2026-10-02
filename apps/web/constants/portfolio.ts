import { PortfolioReelVariant, ProjectSector } from '@/enums/portfolio';
import type { ServiceVisualKind } from '@workspace/service-visuals';

/**
 * Which treatment the highlighted work gets on `/portfolio`. Both are built —
 * change this one value to compare them.
 *
 * TODO: PM to choose.
 */
export const portfolioReelVariant = PortfolioReelVariant.PREMIERE;

export const portfolioHeroLead =
	'Builds across the sectors we work in, and the change each one actually made. Every project below states where it started and where it landed — including the ones that took longer than we said they would.';

export const portfolioCtaHeading = 'Recognise your own situation?';
export const portfolioCtaLead =
	'Most of this work started with someone describing a process they had outgrown. A discovery call is the fastest way to find out whether yours is the same shape.';

/** How many index rows land at a time, before and after "Load more". */
export const archivePageSize = 4;

/**
 * The scenery each chapter of the reel plays against, borrowed from the
 * specimens the services pages use.
 *
 * Per chapter rather than per project on purpose. Building one of these scenes
 * is real work on the main thread, and scrolling the whole reel would pay for
 * it ten times over — this way it happens four times, and the change of scenery
 * is what tells you the sector changed rather than another label saying so.
 */
export const projectSectorVisuals: Record<ProjectSector, ServiceVisualKind> = {
	[ProjectSector.OPERATIONS]: 'grid-lattice',
	[ProjectSector.RETAIL]: 'catalog-checkout',
	[ProjectSector.FIELD]: 'device-frame',
	[ProjectSector.FINANCE]: 'secure-rail',
	[ProjectSector.PROFESSIONAL]: 'orbit-ring'
};
