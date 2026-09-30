/**
 * Scroll that walks a sequence of steps — a pinned stretch where each step
 * rests in place for most of its share of scroll, then hands over to the next.
 * Shared by the Our Process scroll variant and the services rail.
 */

/** Share of each step's scroll the hand-over to the next plays across. */
const STEP_BLEND = 0.3;
/** How far inside a resting stretch a snap lands, as a share of a step. */
const SNAP_MARGIN = 0.02;

/** 0 → 1 with zero slope at both ends, so a hand-over eases in and out. */
function smoothstep(value: number) {
	const t = Math.min(1, Math.max(0, value));

	return t * t * (3 - 2 * t);
}

/**
 * Maps raw scroll progress through the steps (0 → `count`) onto the rail's
 * position (0 → `count - 1`) as a smooth staircase: each step rests fully
 * open for most of its stretch of scroll, and the hand-over to the next plays
 * across the `blend` share of a step centred on the boundary. Continuous and
 * reversible, so the rail moves exactly with the scroll and never snaps.
 */
export function stepPosition(raw: number, count: number, blend = STEP_BLEND) {
	const shifted = raw - 0.5;
	const step = Math.floor(shifted);
	const within = shifted - step;
	const eased = smoothstep((within - (1 - blend) / 2) / blend);

	return Math.min(count - 1, Math.max(0, step + eased));
}

/**
 * Where a scroll that came to rest at `progress` (0 → 1) should settle.
 * Stopped mid-hand-over, two rows sit half open; this eases the page the
 * short way to the nearest resting stretch instead. Anywhere else it leaves
 * the scroll exactly where the reader put it.
 */
export function restingProgress(
	progress: number,
	count: number,
	blend = STEP_BLEND
) {
	const shifted = progress * count - 0.5;
	const step = Math.floor(shifted);
	const within = shifted - step;
	const from = (1 - blend) / 2;
	const to = (1 + blend) / 2;

	if (within <= from || within >= to) return progress;

	const landing = within < 0.5 ? from - SNAP_MARGIN : to + SNAP_MARGIN;

	return Math.min(1, Math.max(0, (step + landing + 0.5) / count));
}
