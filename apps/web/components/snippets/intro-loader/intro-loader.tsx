'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { Logo } from '@/components/snippets/logo/logo';
import {
	introPageAttribute,
	loaderTickerScript,
	loaderWaitingCap
} from '@/constants/intro';
import { realTimeSeconds } from '@/utils/animation';

gsap.registerPlugin(useGSAP);

/** Past the minimum, give up waiting on assets after this long. */
const MAX_EXTRA_SECONDS = 1.5;
/** Share of the gap the shown count closes each frame — keeps it rolling. */
const COUNT_EASE = 0.12;
const DONE_THRESHOLD = 0.995;

interface IntroLoaderProps {
	/** Whether to run at all. Off, it stays hidden (the CSS gate hides it). */
	active: boolean;
	/** Minimum time on screen, in seconds. */
	minSeconds: number;
	/** Everything the hero needs has loaded. */
	ready: boolean;
	/** The screen has started to split — time for the reveal underneath. */
	onReveal: () => void;
	/** Fully open and removed. */
	onDone: () => void;
}

/**
 * The home intro: the wordmark lit through a mask, a hairline whose length is
 * the progress, and a count that rolls to 100 — then the screen splits open
 * along the hairline, so what comes next appears exactly where the line was.
 *
 * Positioned `fixed` inside the smoothed content on purpose: scroll is locked
 * while it shows, so at scroll 0 that is the viewport either way, and it can
 * be server-rendered to cover the very first paint.
 */
export function IntroLoader({
	active,
	minSeconds,
	ready,
	onReveal,
	onDone
}: IntroLoaderProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const readyRef = useRef(ready);
	const callbacksRef = useRef({ onReveal, onDone });

	// The ticker script marks the page on a full load; this covers a
	// client-side arrival, and clears the mark when the page is left.
	useLayoutEffect(() => {
		const html = document.documentElement;
		html.setAttribute(introPageAttribute, '');

		return () => html.removeAttribute(introPageAttribute);
	}, []);

	useEffect(() => {
		readyRef.current = ready;
		callbacksRef.current = { onReveal, onDone };
	}, [onDone, onReveal, ready]);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!active || !root) return;

			const q = gsap.utils.selector(root);
			const [count] = q('[data-loader-count]');
			const [line] = q('[data-loader-line]');
			if (!count || !line) return;

			// Take over from the pre-hydration ticker where it got to. It
			// counts from navigation start, so its progress says how long
			// the visitor has already waited — nothing restarts at hydration.
			root.dataset.loaderLive = '';
			let shown = Number(count.textContent) / 100 || 0;
			const start = performance.now() - shown * minSeconds * 1000;
			let frame = 0;

			const exit = () => {
				gsap.timeline({
					onComplete: () => {
						root.style.display = 'none';
						callbacksRef.current.onDone();
					}
				})
					.to(q('[data-loader-lift]'), {
						yPercent: -60,
						opacity: 0,
						duration: realTimeSeconds(0.45),
						ease: 'power3.in',
						stagger: realTimeSeconds(0.05)
					})
					.to(
						line,
						{
							scaleX: 1,
							duration: realTimeSeconds(0.25),
							ease: 'power2.out'
						},
						'<'
					)
					// The split starts as the count lifts away, not after.
					.add(
						() => callbacksRef.current.onReveal(),
						`-=${realTimeSeconds(0.15)}`
					)
					.to(line, { opacity: 0, duration: realTimeSeconds(0.4) })
					.to(
						q('[data-loader-panel="top"]'),
						{
							yPercent: -100,
							duration: realTimeSeconds(1.1),
							ease: 'expo.inOut'
						},
						'<'
					)
					.to(
						q('[data-loader-panel="bottom"]'),
						{
							yPercent: 100,
							duration: realTimeSeconds(1.1),
							ease: 'expo.inOut'
						},
						'<'
					);
			};

			const tick = () => {
				// Real seconds: this is how long the visitor waits, so the
				// animation-speed dial doesn't stretch it.
				const elapsed = (performance.now() - start) / 1000;
				const timeProgress = Math.min(elapsed / minSeconds, 1);
				const target = readyRef.current
					? timeProgress
					: Math.min(timeProgress, loaderWaitingCap);

				shown += (target - shown) * COUNT_EASE;
				count.textContent = String(Math.round(shown * 100)).padStart(
					3,
					'0'
				);
				gsap.set(line, { scaleX: shown });

				const finished =
					timeProgress >= 1 &&
					readyRef.current &&
					shown >= DONE_THRESHOLD;
				const timedOut = elapsed > minSeconds + MAX_EXTRA_SECONDS;

				if (finished || timedOut) {
					count.textContent = '100';
					exit();
					return;
				}

				frame = requestAnimationFrame(tick);
			};

			frame = requestAnimationFrame(tick);

			return () => cancelAnimationFrame(frame);
		},
		{ dependencies: [active, minSeconds], scope: rootRef }
	);

	return (
		<div
			ref={rootRef}
			data-intro-loader
			data-min-seconds={minSeconds}
			aria-hidden
			className="fixed inset-x-0 top-0 z-50 h-svh overflow-hidden"
		>
			<div
				data-loader-panel="top"
				className="absolute inset-x-0 top-0 h-1/2 bg-background"
			/>
			<div
				data-loader-panel="bottom"
				className="absolute inset-x-0 bottom-0 h-1/2 bg-background"
			/>

			<span
				data-loader-line
				suppressHydrationWarning
				className="absolute inset-x-0 top-1/2 h-px origin-left scale-x-0 bg-primary shadow-[0_0_18px_var(--color-primary)]"
			/>

			<div
				data-loader-lift
				className="absolute inset-x-0 top-1/2 flex -translate-y-[calc(100%+2.5rem)] justify-center"
			>
				<span className="inline-flex scale-[1.6] animate-loader-mark">
					<Logo />
				</span>
			</div>

			<span
				data-loader-lift
				data-loader-count
				suppressHydrationWarning
				className="absolute right-6 bottom-4 font-heading text-[clamp(4.5rem,13vw,11rem)] leading-none font-semibold tracking-tight text-foreground/90 tabular-nums sm:right-10 sm:bottom-6"
			>
				000
			</span>

			{/* Rolls the count from the first paint, before this component has
			    hydrated — see `loaderTickerScript`. */}
			<script dangerouslySetInnerHTML={{ __html: loaderTickerScript }} />
		</div>
	);
}
