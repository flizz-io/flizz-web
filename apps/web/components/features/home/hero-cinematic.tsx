'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from 'react';

import { HeroAtmosphere } from '@/components/features/home/hero-atmosphere';
import { HeroCinematicCopy } from '@/components/features/home/hero-cinematic-copy';
import { IntroLoader } from '@/components/snippets/intro-loader/intro-loader';
import {
	heroCinematicCopy,
	heroCinematicFacts,
	heroDisciplinesSceneConfig,
	heroScrollTargetId
} from '@/constants/home';
import { introQueryParam, introSessionKey } from '@/constants/intro';
import { useIntro } from '@/contexts/intro-context';
import { useSmoother } from '@/contexts/smooth-scroll-context';
import { IntroGate, IntroPhase } from '@/enums/intro';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { HeroCinematicConfig } from '@/types/home';
import { scrollToElement, scrollToPosition } from '@/utils/scroll';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { cn } from '@workspace/ui/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Three.js is heavy — keep it out of the initial bundle.
const HeroDisciplinesScene = dynamic(
	() =>
		import('./hero-disciplines-scene').then(
			(mod) => mod.HeroDisciplinesScene
		),
	{ ssr: false }
);

const MIN_LOADER_SECONDS = 3;
const MAX_LOADER_SECONDS = 5;
/** How much larger the scene holds while it has the stage to itself. */
const CENTRED_SCALE = 1.12;
/** Any of these counts as the reader taking over from the auto-advance. */
const TAKEOVER_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Read live rather than from the media-query hooks: those report their server
 * value until hydration settles, and a skipped intro reveals before that.
 */
function motionNow() {
	const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;

	return {
		reduced,
		pinned: !reduced && window.matchMedia(DESKTOP_QUERY).matches
	};
}

/**
 * Whether this load plays the intro. Read once on the client: the pre-paint
 * gate covers a full load, but a client-side return to the home page never
 * re-runs it, so the session flag is checked here too.
 */
function decideIntro(showLoader: boolean) {
	if (!showLoader) return false;

	try {
		const forced = new URLSearchParams(window.location.search).get(
			introQueryParam
		);
		if (forced === '1') return true;
		if (forced === '0') return false;

		return (
			sessionStorage.getItem(introSessionKey) !== '1' &&
			!window.matchMedia(REDUCED_MOTION_QUERY).matches
		);
	} catch {
		return true;
	}
}

/**
 * Hero v3: an intro loader, a reveal, then a scroll-driven hand-off.
 *
 * The scene opens alone in the centre of the stage. On large screens the
 * section then pins, and scrolling slides the scene into the right column
 * while the copy builds in on the left. The real layout is the final one —
 * the centred start is a measured offset the timeline eases back to zero —
 * so it holds at every width and anything that measures the page (the "See
 * the works" jump) still lands true. See docs/requirements/home-hero-cinematic.md.
 */
export function HeroCinematic({
	loaderSeconds,
	showLoader,
	scrollDistance,
	autoAdvanceSeconds,
	rotatingPhrases,
	phraseHoldSeconds
}: HeroCinematicConfig) {
	const minSeconds = gsap.utils.clamp(
		MIN_LOADER_SECONDS,
		MAX_LOADER_SECONDS,
		loaderSeconds
	);
	const { setPhase } = useIntro();
	const smoother = useSmoother();
	const reduceMotion = usePrefersReducedMotion();
	const isDesktop = useMediaQuery(DESKTOP_QUERY);

	const sectionRef = useRef<HTMLElement>(null);
	const travelRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<HTMLDivElement>(null);
	const captionRef = useRef<HTMLDivElement>(null);
	const captionInnerRef = useRef<HTMLDivElement>(null);
	const copyRef = useRef<HTMLDivElement>(null);
	const handOffRef = useRef<ScrollTrigger | null>(null);

	// Decided once, on the client's first render. The server has no say (it
	// renders the loader either way and the pre-paint gate hides it), and
	// nothing rendered depends on the answer, so hydration can't disagree.
	const [playIntro] = useState(() =>
		typeof window === 'undefined' ? false : decideIntro(showLoader)
	);
	const [sceneReady, setSceneReady] = useState(false);
	const [fontsReady, setFontsReady] = useState(false);
	const [revealed, setRevealed] = useState(false);

	const pinned = isDesktop && !reduceMotion;

	const scrollToHandOffEnd = useCallback(() => {
		const end = handOffRef.current?.end;
		if (end === undefined) return;

		scrollToPosition(smoother, end, { cinematic: true });
	}, [smoother]);

	const scrollToWork = useCallback(() => {
		const target = document.getElementById(heroScrollTargetId);
		if (target) scrollToElement(smoother, target, { cinematic: true });
	}, [smoother]);

	// The gate follows the decision — a client-side return to the page never
	// re-runs the pre-paint script, so this is what hides a spent loader.
	useLayoutEffect(() => {
		document.documentElement.dataset.intro = playIntro
			? IntroGate.PLAY
			: IntroGate.SKIP;
	}, [playIntro]);

	/** The scene (and stage caption) arriving — after the loader, or at once. */
	const reveal = useCallback(() => {
		setPhase(IntroPhase.REVEALING);
		const motion = motionNow();

		const timeline = gsap.timeline({
			onComplete: () => {
				setRevealed(true);
				if (!playIntro) setPhase(IntroPhase.DONE);
			}
		});

		if (motion.reduced) {
			gsap.set([revealRef.current, captionInnerRef.current], {
				opacity: 1
			});
			timeline.progress(1);
			return;
		}

		timeline.fromTo(
			revealRef.current,
			{ opacity: 0, scale: 0.9, filter: 'blur(18px)' },
			{
				opacity: 1,
				scale: 1,
				filter: 'blur(0px)',
				duration: 1.9,
				ease: 'expo.out',
				clearProps: 'filter'
			}
		);

		if (motion.pinned) {
			timeline.fromTo(
				captionInnerRef.current,
				{ opacity: 0, y: 18 },
				{ opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
				0.7
			);
		} else {
			// Small screens: no scroll hand-off, so the copy plays its
			// entrance here, once.
			const copy = gsap.utils.selector(copyRef.current);
			timeline
				.fromTo(
					copy('[data-copy-line]'),
					{ yPercent: 115 },
					{
						yPercent: 0,
						duration: 1.1,
						ease: 'power4.out',
						stagger: 0.1
					},
					0.4
				)
				.fromTo(
					copy('[data-copy-word]'),
					{ opacity: 0, filter: 'blur(8px)' },
					{
						opacity: 1,
						filter: 'blur(0px)',
						duration: 0.6,
						stagger: 0.02
					},
					0.8
				)
				.fromTo(
					copy('[data-copy-reveal]'),
					{ opacity: 0, y: 20 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: 'power3.out',
						stagger: 0.12
					},
					1.1
				);
		}
	}, [playIntro, setPhase]);

	const onLoaderDone = useCallback(() => {
		try {
			sessionStorage.setItem(introSessionKey, '1');
		} catch {
			// Storage blocked: it just plays again next load.
		}
		document.documentElement.dataset.intro = IntroGate.SKIP;
		setPhase(IntroPhase.DONE);
	}, [setPhase]);

	useEffect(() => {
		let cancelled = false;
		document.fonts.ready.then(() => {
			if (!cancelled) setFontsReady(true);
		});

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		// Skipped intro: reveal straight away, once.
		if (!playIntro) reveal();
		// Mount only — `reveal` changing identity must not replay it.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// Nothing scrolls while the loader holds the screen.
		if (!smoother || !playIntro || revealed) return;

		smoother.paused(true);

		return () => {
			smoother.paused(false);
		};
	}, [playIntro, revealed, smoother]);

	useEffect(() => {
		if (!revealed || !pinned || autoAdvanceSeconds <= 0) return;

		// Nobody should miss the headline for not scrolling: if the reader
		// sits on the opening stage, the hand-off plays itself, slowly.
		const takeOver = () => {
			window.clearTimeout(timer);
			TAKEOVER_EVENTS.forEach((type) =>
				window.removeEventListener(type, takeOver)
			);
		};
		const timer = window.setTimeout(() => {
			takeOver();
			if (window.scrollY < 8) scrollToHandOffEnd();
		}, autoAdvanceSeconds * 1000);

		TAKEOVER_EVENTS.forEach((type) =>
			window.addEventListener(type, takeOver, { passive: true })
		);

		return takeOver;
	}, [autoAdvanceSeconds, pinned, revealed, scrollToHandOffEnd]);

	// --- the pinned, scrubbed hand-off (large screens) -----------------------
	useGSAP(
		() => {
			const section = sectionRef.current;
			const travel = travelRef.current;
			const copyRoot = copyRef.current;
			if (!pinned || !smoother || !section || !travel || !copyRoot)
				return;

			const copy = gsap.utils.selector(copyRoot);
			const [count] = copy('[data-copy-count]');

			// How far the scene sits from the stage's centre in the final
			// layout — measured with its own transform taken out.
			const centreOffset = () => {
				const stage = section.getBoundingClientRect();
				const scene = travel.getBoundingClientRect();
				const current = Number(gsap.getProperty(travel, 'x')) || 0;

				return (
					stage.left +
					stage.width / 2 -
					(scene.left + scene.width / 2 - current)
				);
			};

			const timeline = gsap.timeline({
				defaults: { ease: 'none' },
				scrollTrigger: {
					trigger: section,
					// The section sits under the header's reserved space, so
					// it pins from the very first pixel of scroll.
					start: () => `top top+=${section.offsetTop}`,
					end: () =>
						`+=${(window.innerHeight * scrollDistance) / 100}`,
					pin: true,
					scrub: 1.2,
					invalidateOnRefresh: true
				}
			});

			timeline
				.fromTo(
					captionRef.current,
					{ opacity: 1, y: 0 },
					{
						opacity: 0,
						y: -40,
						duration: 0.2,
						immediateRender: false
					},
					0
				)
				.fromTo(
					travel,
					{ x: centreOffset, scale: CENTRED_SCALE },
					{ x: 0, scale: 1, duration: 1, ease: 'power2.inOut' },
					0
				)
				.fromTo(
					copyRoot,
					{ x: -90 },
					{ x: 0, duration: 0.8, ease: 'power3.out' },
					0.3
				)
				.fromTo(
					copy('[data-copy-line]'),
					{ yPercent: 115 },
					{
						yPercent: 0,
						duration: 0.45,
						ease: 'power4.out',
						stagger: 0.1
					},
					0.35
				)
				.fromTo(
					copy('[data-copy-word]'),
					{ opacity: 0, filter: 'blur(8px)' },
					{
						opacity: 1,
						filter: 'blur(0px)',
						duration: 0.3,
						stagger: 0.012
					},
					0.6
				)
				.fromTo(
					copy('[data-copy-reveal]'),
					{ opacity: 0, y: 24 },
					{
						opacity: 1,
						y: 0,
						duration: 0.3,
						ease: 'power3.out',
						stagger: 0.08
					},
					0.85
				);

			if (count) {
				timeline.fromTo(
					count,
					{ innerText: 0 },
					{
						innerText: heroCinematicFacts.projectCount,
						snap: { innerText: 1 },
						duration: 0.3
					},
					0.95
				);
			}

			handOffRef.current = timeline.scrollTrigger ?? null;

			return () => {
				handOffRef.current = null;
			};
		},
		{ dependencies: [pinned, smoother, scrollDistance], scope: sectionRef }
	);

	return (
		<>
			<IntroLoader
				active={playIntro}
				minSeconds={minSeconds}
				ready={sceneReady && fontsReady}
				onReveal={reveal}
				onDone={onLoaderDone}
			/>

			<section
				ref={sectionRef}
				className="relative overflow-hidden lg:h-[calc(100svh-4rem)] lg:min-h-160"
			>
				<HeroAtmosphere />

				<div className="relative mx-auto grid h-full max-w-8xl grid-cols-1 items-center gap-12 px-4 pt-12 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:px-8 lg:py-0">
					<div
						ref={copyRef}
						className="relative z-10"
					>
						<HeroCinematicCopy
							phrases={rotatingPhrases}
							phraseHoldSeconds={phraseHoldSeconds}
							running={revealed}
							projectCount={heroCinematicFacts.projectCount}
							sinceYear={heroCinematicFacts.sinceYear}
							onSeeWorks={scrollToWork}
						/>
					</div>

					{/* Square, and never taller than the stage, so the
					    constellation neither distorts nor clips. Listed after
					    the copy for reading order; shown first on phones. */}
					<div
						ref={travelRef}
						className="relative order-first aspect-square w-full max-w-xl justify-self-center lg:order-none lg:w-[min(100%,calc(100svh-10rem))] lg:max-w-none"
					>
						<div
							ref={revealRef}
							className={cn(
								'absolute inset-0',
								!reduceMotion && 'opacity-0'
							)}
						>
							<HeroDisciplinesScene
								{...heroDisciplinesSceneConfig}
								onReady={() => setSceneReady(true)}
							/>
						</div>
					</div>
				</div>

				{/* The opening stage's caption: what this is, and how to go on.
				    Gone before the copy arrives to say it properly. */}
				{/* Always rendered, hidden by CSS below `lg`: a skipped intro
				    reveals before the media query settles, and a caption that
				    didn't exist yet would never get its fade-in. */}
				<div
					ref={captionRef}
					className="pointer-events-none absolute inset-x-0 bottom-10 z-10 hidden justify-center motion-safe:lg:flex"
				>
					<div
						ref={captionInnerRef}
						className="pointer-events-auto flex flex-col items-center gap-4 opacity-0"
					>
						<p className="text-base text-foreground/75">
							{heroCinematicCopy.caption}
						</p>
						<button
							type="button"
							onClick={scrollToHandOffEnd}
							className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowDown className="size-4 text-primary drop-shadow-[0_0_6px_var(--color-primary)] group-hover:paused motion-safe:animate-float-cue" />
							{heroCinematicCopy.scrollCue}
						</button>
					</div>
				</div>
			</section>
		</>
	);
}
