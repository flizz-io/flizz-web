# Home — Hero v3 ("cinematic")

A third hero variation for the home page, alongside `starfield` and `constellation`. Same message and the same `HeroDisciplinesScene`, told as one orchestrated sequence: a loading screen, a header and scene reveal, then a scroll-driven hand-off that moves the scene aside and builds the copy in its place.

Copy source of truth stays in [home-page.md § Hero](home-page.md#hero). Selected in `app/(marketing)/page.tsx` with `<Hero variation="cinematic" />`; the other two variations remain available.

## Sequence

### 1. Intro loader

- Covers the first screen while the hero loads underneath it. The hero is fully server-rendered behind it, so crawlers and screen readers get the real content.
- Ends at the **latest** of: `loaderSeconds` (3–5s, clamped), web fonts ready, and the scene's first frame drawn (`HeroDisciplinesScene` `onReady`). A hard ceiling of `loaderSeconds + 4s` stops a stalled asset from holding the page hostage.
- Content, and nothing else:
    - the Flizzio wordmark, revealed by a light-pass mask;
    - a hairline across the vertical centre whose length **is** the progress;
    - a large count, 000 → 100, in the heading face with tabular figures, bottom right. It follows real progress but never completes before the minimum time.
- Exit: the wordmark and count lift away, the hairline completes, and the screen splits open along it — top half up, bottom half down — so the scene appears where the line was.
- Page scroll is locked while it shows (ScrollSmoother paused).
- **Once per browser session** (`sessionStorage`). Later loads in the session skip straight to a short reveal. `?intro=1` forces it (for tuning), `?intro=0` skips it.
- Skipped entirely under `prefers-reduced-motion`.
- No flash on skipped loads: an inline script in the root layout sets `html[data-intro]` to `play` or `skip` before first paint, and CSS hides the loader (and holds the header back) from that attribute alone.

### 2. Reveal

- **Header** (shared by every page): the pill opens from its centre outward (clip-path), un-blurring as it drops in, then the nav items settle in one after another. It only runs when the intro played — every other page and every skipped load shows the header exactly as today.
- **Scene**: arrives in the centre of the hero, easing up from 0.9 scale out of a blur.
- **Stage-A caption** under the scene: "Your Technology Partner" and a scroll cue with the floating arrow.
- Coordinated through `contexts/intro-context.tsx` — phase `PENDING → REVEALING → DONE`.

### 3. Scroll hand-off (large screens)

- The hero pins (ScrollTrigger `pin`, inside ScrollSmoother) for `scrollDistance` % of a screen of extra scroll, scrubbed.
- Over that travel:
    - the stage-A caption lifts away first;
    - the scene slides from centre into the right column and eases to its resting scale;
    - the copy builds from the left: headline lines rise out of masks, the client logo strip (placeholder wordmarks from `socialProofLogos`, looping marquee that pauses on hover) resolves from blur, then the actions and the facts line.
- The real layout is the **final** one (copy left, scene right). The centred start is a measured offset the timeline animates back to zero, so it stays correct at every width and the "See the works" jump still lands on the right section.
- **Auto-advance:** if the reader hasn't scrolled `autoAdvanceSeconds` (default 4) after the reveal, the page scrolls itself — slowly, via the cinematic scroll — to the end of the pin, so nobody is left without the headline and CTA. Any wheel/touch/key input cancels it. `0` disables it.

### 4. Parallax

Four depth planes — `HeroDepth` (`enums/home.ts`): the aurora glows (`FAR`), the particles (`MID`), the scene (`SCENE`) and the copy (`COPY`). Built with GSAP in `hooks/use-hero-parallax.ts`; every depth lives in `heroParallax` (`constants/home.ts`).

- **Exit** (all sizes): as the hero scrolls away, each plane trails (+) or leads (−) the page by its `scroll` share of the hero's height. Starts where the pin ends (or at the top when nothing pins).
- **Hand-off** (large screens): while pinned, `FAR` and `MID` drift by their `pinned` % so the stage never reads as a flat backdrop.
- **Pointer** (fine pointers only): planes lean with the cursor by `pointer` px; negative counters it. Paused while a button is held so it never fights a drag on the scene. It moves each plane's inner `[data-hero-pointer]` layer, so it never shares a transform with the scroll layers.
- Off under reduced motion.

### Small screens and reduced motion

- Below `lg`: no pin, no travel. The scene sits above the copy; the copy plays one short entrance after the reveal.
- Reduced motion: no loader, no pin, no rotation — the final layout, static.

## Copy block design

One bold element — the headline's rotating third line. Everything around it stays quiet.

- **Headline** (Space Grotesk, very large, tight): "Your technology / partner for" then a third line in **Instrument Serif italic** that rotates between **what's next. / what scales. / what lasts.** Each phrase holds ~3s; letters roll out upward and the next phrase rolls in from below, inside a mask. "what's next." is the first phrase and the only one in the accessible name; the others are `aria-hidden`.
- **Subtext**: the existing sentence, unchanged.
- **Actions**: primary "Schedule a discovery call" (no trailing arrow glyph) with a subtle magnetic lean toward the cursor; secondary "See the works" in sentence case with the floating arrow, cinematic scroll to Our Work.
- **Facts line**: two plain sentences under a hairline — "{n} projects shipped since {first year}." computed from the portfolio data (the number counts up on reveal), and "Replies within one business day." with a pulsing dot.
- Removed from the v2 design: the mono all-caps eyebrow pill, the arrow glyph in the CTA, mono all-caps link text.

## Controls — `heroCinematicConfig` (`constants/home.ts`)

| Prop                 | Default                                           | Meaning                                                         |
| -------------------- | ------------------------------------------------- | --------------------------------------------------------------- |
| `loaderSeconds`      | `3.5`                                             | Minimum loader time, clamped 3–5.                               |
| `showLoader`         | `true`                                            | Off skips straight to the reveal.                               |
| `scrollDistance`     | `120`                                             | Pinned scroll travel, % of the viewport height.                 |
| `autoAdvanceSeconds` | `4`                                               | Idle time before the hand-off plays itself; `0` disables.       |
| `rotatingPhrases`    | `["what's next.", "what scales.", "what lasts."]` | Third headline line, in order; the first is the accessible one. |
| `phraseHoldSeconds`  | `3`                                               | How long each phrase holds.                                     |

## Animation speed

The whole landing site's animation speed is one dial: `NEXT_PUBLIC_ANIMATION_SPEED` (`1` = as authored, `0.5` = half speed), clamped 0.1–3, falling back to `defaultAnimationSpeed` (`0.7`) in `constants/animation.ts`. Resolved in `configs/animation.ts`, it drives GSAP's global time scale, a `--motion-scale` CSS variable on `<html>` (which the `duration-*` / `delay-*` utilities and the `animate-*` keyframe tokens multiply by), Motion transitions (via `scaleTransition` / `scaleVariants` in `utils/animation.ts`), and the Three.js scene clocks. Scroll smoothing, drag response, and timer-based waits (the hand-off auto-advance, carousel autoplay) stay in real time; holds built into GSAP timelines, like the rotating phrase's, slow down with everything else.

## Files

| File                                                   | Role                                                      |
| ------------------------------------------------------ | --------------------------------------------------------- |
| `enums/intro.ts`                                       | `IntroPhase`.                                             |
| `contexts/intro-context.tsx`                           | Intro phase provider + `useIntro()`.                      |
| `components/snippets/intro-loader/intro-loader.tsx`    | The loading screen and its exit.                          |
| `components/features/home/hero-atmosphere.tsx`         | Background layers, extracted from v2 and shared by both.  |
| `components/features/home/hero-cinematic.tsx`          | The variation: stage, pin, scroll timeline, auto-advance. |
| `components/features/home/hero-cinematic-copy.tsx`     | The copy block and its rotating line.                     |
| `hooks/use-hero-parallax.ts`                           | Exit, hand-off and pointer parallax.                      |
| `components/features/home/hero-disciplines-scene.tsx`  | Adds `onReady`.                                           |
| `components/snippets/header/header.tsx`                | Intro entrance.                                           |
| `app/layout.tsx`, `packages/ui/src/styles/globals.css` | `data-intro` pre-paint script and gating CSS.             |

## Build order

1. Intro phase enum + context; `data-intro` pre-paint script and CSS gate.
2. `onReady` on `HeroDisciplinesScene`; extract `HeroAtmosphere`.
3. Intro loader (timing, progress, exit) and scroll lock.
4. Header entrance.
5. Hero v3 layout, scene reveal, stage-A caption.
6. Pinned scroll timeline + auto-advance; small-screen and reduced-motion paths.
7. Copy block: rotating line, word resolve, magnetic CTA, facts line.
8. Wire `variation="cinematic"` on the home page; verify with headless screenshots at desktop and mobile widths; typecheck + lint.

## Open items

- The availability sentence ("Replies within one business day.") matches the contact page promise — swap for a quarterly availability line if the PM wants one.
- Scene nodes popping in one by one during the reveal needs hooks inside the scene; not in this pass.
