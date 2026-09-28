// One feel for every smoothed scroll: the page (ScrollSmoother) and any
// horizontal strip that eases on its own both catch up over this long, on
// GSAP's expo curve — ScrollSmoother's default ease.
//
// Matched to Lenis at `lerp: 0.09` (the forgeautomotive.co.uk feel): Lenis
// closes 9% of the gap each frame, and 1.2s of expo.out tracks that curve —
// ~82% of the way at 0.3s, ~97% at 0.6s, on both.
export const smoothScrollSeconds = 1.2;
export const smoothScrollEase = 'expo.out';
