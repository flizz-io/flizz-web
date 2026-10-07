'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
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
	heroDisciplinesSceneConfig,
	heroScrollTargetId
} from '@/constants/home';
import { introQueryParam, introSessionKey } from '@/constants/intro';
import { useIntro } from '@/contexts/intro-context';
import { useSmoother } from '@/contexts/smooth-scroll-context';
import { HeroDepth } from '@/enums/home';
import { IntroGate, IntroPhase } from '@/enums/intro';
import { useHeroParallax } from '@/hooks/use-hero-parallax';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { HeroCinematicConfig, HeroFacts } from '@/types/home';
import { scrollToElement } from '@/utils/scroll';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { cn } from '@workspace/ui/lib/utils';

gsap.registerPlugin(useGSAP);

// Three.js is heavy — keep it out of the initial bundle.
const HeroDisciplinesScene = dynamic(
	() =>
		import('./hero-disciplines-scene').then(
			(mod) => mod.HeroDisciplinesScene
		),
	{ ssr: false }
);

const MIN_LOADER_SECONDS = 1.5;
const MAX_LOADER_SECONDS = 4;
/** How much larger the scene holds while it has the stage to itself. */
const CENTRED_SCALE = 1.12;
/** Any of these counts as the reader taking over from the auto-advance. */
const TAKEOVER_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
/** …and any of these, as the reader asking the stage to hand over. */
const INTENT_EVENTS = ['wheel', 'touchmove', 'keydown'];
/** The keys that mean "move down the page" — the rest leave the stage alone. */
const INTENT_KEYS = [
	'ArrowDown',
	'ArrowUp',
	'PageDown',
	'PageUp',
	'Home',
	'End',
	' ',
	'Spacebar'
];
/** How much faster the hand-off runs for a reader who keeps pushing. */
const HURRY_SCALE = 2;
/** Scrolled further than this and the stage is not what they are looking at. */
const TOP_SLACK = 4;
/** How long the page has to hold a position before it counts as settled. */
const SETTLE_MS = 200;
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
		staged: !reduced && window.matchMedia(DESKTOP_QUERY).matches
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

interface HeroCinematicProps extends HeroCinematicConfig {
	/** Omitted → the facts line is left out rather than showing zeros. */
	facts?: HeroFacts;
}

/**
 * Hero v3: an intro loader, a reveal, then the stage handing over.
 *
 * The scene opens alone in the centre of the stage. On large screens the first
 * sign the reader wants to move on — a wheel, the cue, or simply waiting —
 * plays the hand-off: the scene slides into its column while the copy builds
 * in beside it, over `handOffSeconds`, with the page held still for exactly
 * that long. It plays once a load and nothing winds it back, so the stage is
 * gone until the page is reloaded.
 *
 * Nothing about it touches the page's height: the real layout is the final one
 * and the opening stage is a set of transforms over it, so anything that
 * measures the page (the "See the works" jump) lands true throughout.
 * See docs/requirements/home-hero-cinematic.md.
 */
export function HeroCinematic({
	loaderSeconds,
	showLoader,
	handOffSeconds,
	autoAdvanceSeconds,
	rotatingPhrases,
	phraseHoldSeconds,
	facts
}: HeroCinematicProps) {
	const minSeconds = gsap.utils.clamp(
		MIN_LOADER_SECONDS,
		MAX_LOADER_SECONDS,
		loaderSeconds
	);
	const { phase, setPhase } = useIntro();
	const smoother = useSmoother();
	const reduceMotion = usePrefersReducedMotion();
	const isDesktop = useMediaQuery(DESKTOP_QUERY);

	const sectionRef = useRef<HTMLElement>(null);
	const travelRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<HTMLDivElement>(null);
	const captionRef = useRef<HTMLDivElement>(null);
	const captionInnerRef = useRef<HTMLDivElement>(null);
	const copyRef = useRef<HTMLDivElement>(null);
	const handOffRef = useRef<gsap.core.Timeline | null>(null);
	/** The hand-off's authored speed, to hurry it from and settle back to. */
	const baseScaleRef = useRef(1);
	/** Set the moment the hand-off starts: the stage never opens twice. */
	const spentRef = useRef(false);
	/** Whether the hand-off is the one holding the page still. */
	const lockedRef = useRef(false);

	// Decided once, on the client's first render. The server has no say (it
	// renders the loader either way and the pre-paint gate hides it), and
	// nothing rendered depends on the answer, so hydration can't disagree.
	const [playIntro] = useState(() =>
		typeof window === 'undefined' ? false : decideIntro(showLoader)
	);
	const [sceneReady, setSceneReady] = useState(false);
	const [fontsReady, setFontsReady] = useState(false);
	const [revealed, setRevealed] = useState(false);
	/** The hand-off has finished; the stage is off the page. */
	const [handedOff, setHandedOff] = useState(false);

	/** Large screens with motion allowed — the only place the stage opens. */
	const staged = isDesktop && !reduceMotion;

	/** Hands the page back after the hand-off has held it still. */
	const releaseScroll = useCallback(() => {
		if (!lockedRef.current) return;

		lockedRef.current = false;
		smoother?.paused(false);
	}, [smoother]);

	/**
	 * The stage handing over — once a load, by wheel, cue or auto-advance.
	 *
	 * The page is held still for the length of it: the reader asked for the
	 * hand-off, and there is nothing below worth scrolling to until the hero
	 * has finished assembling. Asking again while it runs hurries it along
	 * rather than queueing a second one. `instant` is for a reader who is
	 * already past the hero — a restored scroll position, or a link into a
	 * section — where the stage has nothing left to say.
	 */
	const playHandOff = useCallback(
		({ instant = false } = {}) => {
			const handOff = handOffRef.current;

			if (spentRef.current) {
				if (handOff?.isActive()) {
					gsap.to(handOff, {
						timeScale: baseScaleRef.current * HURRY_SCALE,
						duration: 0.2,
						overwrite: true
					});
				}
				return;
			}

			spentRef.current = true;

			if (instant || !handOff) {
				handOff?.progress(1);
				setHandedOff(true);
				return;
			}

			if (smoother) {
				lockedRef.current = true;
				smoother.paused(true);
			}
			handOff.play();
		},
		[smoother]
	);

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

		if (motion.staged) {
			timeline.fromTo(
				captionInnerRef.current,
				{ opacity: 0, y: 18 },
				{ opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
				0.7
			);
		} else {
			// Small screens: no opening stage, so the copy plays its
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
			// Unless the hand-off has taken the hold over in the meantime —
			// a wheel during the reveal plays it before this effect is done.
			if (!lockedRef.current) smoother.paused(false);
		};
	}, [playIntro, revealed, smoother]);

	useEffect(() => {
		if (!staged || handedOff) return;

		// A page that doesn't settle at the top isn't watching the stage: a
		// restored scroll position, a link into a section, the scrollbar
		// dragged. Past the first screen the hero is gone, so it is simply
		// there, assembled, when they come back up; a nudge inside it still
		// gets the hand-off played.
		//
		// Settled, because a client-side return to this page arrives with the
		// last one's scroll position and is put back to the top a frame later.
		let timer = 0;
		const onScroll = () => {
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				const top = window.scrollY;
				if (top <= TOP_SLACK) return;

				playHandOff({ instant: top > window.innerHeight / 2 });
			}, SETTLE_MS);
		};

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.clearTimeout(timer);
			window.removeEventListener('scroll', onScroll);
		};
	}, [handedOff, playHandOff, staged]);

	useEffect(() => {
		// From the moment the hero is on screen, the first sign the reader
		// wants to move on plays the hand-off instead of moving the page.
		if (!staged || handedOff || phase === IntroPhase.IDLE) return;

		const onIntent = (event: Event) => {
			if (
				event instanceof KeyboardEvent &&
				!INTENT_KEYS.includes(event.key)
			) {
				return;
			}

			playHandOff();
		};

		INTENT_EVENTS.forEach((type) =>
			window.addEventListener(type, onIntent, { passive: true })
		);

		return () =>
			INTENT_EVENTS.forEach((type) =>
				window.removeEventListener(type, onIntent)
			);
	}, [handedOff, phase, playHandOff, staged]);

	useEffect(() => {
		if (!revealed || !staged || handedOff || autoAdvanceSeconds <= 0)
			return;

		// Nobody should miss the headline for not scrolling: if the reader
		// sits on the opening stage, the hand-off plays itself.
		const takeOver = () => {
			window.clearTimeout(timer);
			TAKEOVER_EVENTS.forEach((type) =>
				window.removeEventListener(type, takeOver)
			);
		};
		const timer = window.setTimeout(() => {
			takeOver();
			playHandOff();
		}, autoAdvanceSeconds * 1000);

		TAKEOVER_EVENTS.forEach((type) =>
			window.addEventListener(type, takeOver, { passive: true })
		);

		return takeOver;
	}, [autoAdvanceSeconds, handedOff, playHandOff, revealed, staged]);

	// --- the hand-off (large screens) ---------------------------------------
	useGSAP(
		() => {
			const section = sectionRef.current;
			const travel = travelRef.current;
			const copyRoot = copyRef.current;
			if (spentRef.current || !staged || !section || !travel || !copyRoot)
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

			// The opening stage is set, not tweened from: what the markup
			// lays out is the final arrangement, and these transforms are
			// what hold it back until the hand-off runs. The centre is a
			// measurement, so a resize before then takes it again.
			const openStage = () => {
				gsap.set(travel, { x: centreOffset(), scale: CENTRED_SCALE });
				gsap.set(copyRoot, { x: -90 });
				gsap.set(copy('[data-copy-line]'), { yPercent: 115 });
				gsap.set(copy('[data-copy-word]'), {
					opacity: 0,
					filter: 'blur(8px)'
				});
				gsap.set(copy('[data-copy-reveal]'), { opacity: 0, y: 24 });
				if (count) gsap.set(count, { innerText: 0 });
			};
			const onResize = () => {
				if (!spentRef.current) openStage();
			};

			openStage();

			const timeline = gsap.timeline({
				paused: true,
				defaults: { ease: 'none' },
				onComplete: () => {
					releaseScroll();
					setHandedOff(true);
				}
			});

			timeline
				.to(
					captionRef.current,
					{ opacity: 0, y: -40, duration: 0.2 },
					0
				)
				.to(
					travel,
					{ x: 0, scale: 1, duration: 1, ease: 'power2.inOut' },
					0
				)
				.to(copyRoot, { x: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
				.to(
					copy('[data-copy-line]'),
					{
						yPercent: 0,
						duration: 0.45,
						ease: 'power4.out',
						stagger: 0.1
					},
					0.35
				)
				.to(
					copy('[data-copy-word]'),
					{
						opacity: 1,
						filter: 'blur(0px)',
						duration: 0.3,
						stagger: 0.012
					},
					0.6
				)
				.to(
					copy('[data-copy-reveal]'),
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
				timeline.to(
					count,
					{
						innerText: facts?.projectCount ?? 0,
						snap: { innerText: 1 },
						duration: 0.3
					},
					0.95
				);
			}

			// Authored in its own units above; the config says how long the
			// whole beat takes. Kept, so hurrying it has a speed to go back to.
			timeline.totalDuration(handOffSeconds);
			baseScaleRef.current = timeline.timeScale();
			handOffRef.current = timeline;

			window.addEventListener('resize', onResize);

			return () => {
				window.removeEventListener('resize', onResize);
				handOffRef.current = null;
				// Leaving mid-hand-off must not leave the page locked.
				releaseScroll();
			};
		},
		{
			dependencies: [
				handOffSeconds,
				releaseScroll,
				staged,
				facts?.projectCount
			],
			// The stage's transforms come off with it, and what they were
			// holding back is the final layout.
			revertOnUpdate: true,
			scope: sectionRef
		}
	);

	useHeroParallax({
		sectionRef,
		enabled: !reduceMotion && Boolean(smoother),
		holds: staged,
		dependencies: [smoother]
	});

	return (
		<>
			<IntroLoader
				active={playIntro}
				minSeconds={minSeconds}
				ready={sceneReady && fontsReady}
				onReveal={reveal}
				onDone={onLoaderDone}
			/>

			{/* Pulled up under the floating header like every other hero, so the
			    atmosphere fills the header's 4rem too — left out, that strip is
			    bare page colour and reads as a dark band above the hero. The
			    content pads back down by the same 4rem. */}
			<section
				ref={sectionRef}
				className="relative -mt-16 overflow-hidden lg:h-svh lg:min-h-176"
			>
				<HeroAtmosphere />

				<div className="relative mx-auto grid h-full max-w-8xl grid-cols-1 items-center gap-12 px-4 pt-28 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:px-8 lg:pt-16 lg:pb-0">
					<div
						data-hero-depth={HeroDepth.COPY}
						className="relative z-10"
					>
						{/* The hand-off slides the copy in on its own layer,
						    so it never shares a transform with the parallax
						    plane around it — the two are built, reverted and
						    rebuilt independently. */}
						<div ref={copyRef}>
							<HeroCinematicCopy
								phrases={rotatingPhrases}
								phraseHoldSeconds={phraseHoldSeconds}
								running={revealed}
								facts={facts}
								onSeeWorks={scrollToWork}
							/>
						</div>
					</div>

					{/* Square, and never taller than the stage, so the
					    constellation neither distorts nor clips. Listed after
					    the copy for reading order; shown first on phones. */}
					<div
						data-hero-depth={HeroDepth.SCENE}
						className="relative order-first aspect-square w-full max-w-xl justify-self-center lg:order-none lg:w-[min(100%,calc(100svh-10rem))] lg:max-w-none"
					>
						{/* The hand-off's own layer, between the parallax
						    plane and the pointer lean: one transform owner
						    each, so none of them reverts another's. */}
						<div
							ref={travelRef}
							className="absolute inset-0"
						>
							<div
								ref={revealRef}
								data-hero-pointer={HeroDepth.SCENE}
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
				</div>

				{/* The opening stage's caption: what this is, and how to go on.
				    Gone before the copy arrives to say it properly, and gone
				    from the page once the stage has handed over for good. */}
				{/* Until then always rendered, hidden by CSS below `lg`: a
				    skipped intro reveals before the media query settles, and a
				    caption that didn't exist yet would never get its fade-in. */}
				{!handedOff && (
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
								onClick={() => playHandOff()}
								className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<ArrowDown className="size-4 text-primary drop-shadow-[0_0_6px_var(--color-primary)] group-hover:paused motion-safe:animate-float-cue" />
								{heroCinematicCopy.scrollCue}
							</button>
						</div>
					</div>
				)}
			</section>
		</>
	);
}
