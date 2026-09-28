/**
 * Playback speed for every landing-page animation when
 * `NEXT_PUBLIC_ANIMATION_SPEED` is unset or not a usable number. `1` plays
 * everything as authored; below `1` is slower, above `1` faster.
 */
export const defaultAnimationSpeed = 0.7;

/** A speed outside these is clamped — past them nothing reads as motion. */
export const animationSpeedBounds = { min: 0.1, max: 3 } as const;

/**
 * The custom property every CSS duration and delay is multiplied by (see the
 * `duration-*` / `delay-*` overrides in `@workspace/ui/globals.css`). Set on
 * `<html>` by the root layout; unset elsewhere, it falls back to `1`.
 */
export const animationScaleProperty = '--motion-scale';
