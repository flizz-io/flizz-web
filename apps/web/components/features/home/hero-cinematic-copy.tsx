'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { Fragment, useRef } from 'react';

import { heroCinematicCopy } from '@/constants/home';
import { Button } from '@workspace/ui/components/button';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { cn } from '@workspace/ui/lib/utils';

gsap.registerPlugin(useGSAP);

/** Furthest the primary action leans toward the cursor, in px. */
const MAGNET_REACH = 10;
const MAGNET_PULL = 0.3;

interface RotatingPhraseProps {
	phrases: string[];
	holdSeconds: number;
	/** Start cycling — held until the copy is actually on screen. */
	running: boolean;
}

/**
 * The headline's third line. Every phrase shares one grid cell, so the line
 * is always as tall as the tallest and nothing below it shifts; each phrase
 * rolls out upward letter by letter while the next rolls in from below,
 * inside the line's own mask. Only the first phrase is in the accessible
 * name — the rest are presentation.
 */
function RotatingPhrase({
	phrases,
	holdSeconds,
	running
}: RotatingPhraseProps) {
	const rootRef = useRef<HTMLSpanElement>(null);
	const reduceMotion = usePrefersReducedMotion();

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root || !running || reduceMotion || phrases.length < 2) return;

			const groups = gsap.utils
				.toArray<HTMLElement>('[data-phrase]', root)
				.map((phrase) =>
					gsap.utils.toArray<HTMLElement>(
						'[data-phrase-char]',
						phrase
					)
				);

			// Every phrase but the first waits below the mask.
			groups
				.slice(1)
				.forEach((chars) => gsap.set(chars, { yPercent: 110 }));

			const timeline = gsap.timeline({ repeat: -1 });

			groups.forEach((chars, index) => {
				const next = groups[(index + 1) % groups.length];
				if (!next) return;

				timeline
					.to(chars, {
						yPercent: -110,
						rotateX: 70,
						duration: 0.7,
						ease: 'power3.in',
						stagger: 0.025,
						delay: holdSeconds
					})
					.fromTo(
						next,
						{ yPercent: 110, rotateX: -70 },
						{
							yPercent: 0,
							rotateX: 0,
							duration: 0.9,
							ease: 'power3.out',
							stagger: 0.025,
							// The last step brings the first phrase back round; left
							// to render immediately, its `from` would bury that
							// phrase below the mask the moment the loop is built.
							immediateRender: false
						},
						'-=0.45'
					);
			});

			return () => timeline.kill();
		},
		{
			dependencies: [running, reduceMotion, holdSeconds, phrases],
			scope: rootRef
		}
	);

	return (
		<span
			ref={rootRef}
			className="grid overflow-hidden pb-[0.14em] [perspective:600px]"
		>
			{phrases.map((phrase, index) => (
				<span
					key={phrase}
					data-phrase
					aria-hidden={index > 0 || undefined}
					className="col-start-1 row-start-1 whitespace-nowrap"
				>
					{Array.from(phrase).map((char, charIndex) => (
						<span
							key={`${char}-${charIndex}`}
							data-phrase-char
							className="inline-block origin-bottom whitespace-pre"
						>
							{char}
						</span>
					))}
				</span>
			))}
		</span>
	);
}

interface MagneticProps {
	children: React.ReactNode;
}

/** Leans its child a few px toward the cursor, and eases home on leave. */
function Magnetic({ children }: MagneticProps) {
	const reduceMotion = usePrefersReducedMotion();

	const move = (event: React.PointerEvent<HTMLSpanElement>) => {
		if (reduceMotion || event.pointerType !== 'mouse') return;

		const root = event.currentTarget;
		const rect = root.getBoundingClientRect();
		const clampReach = gsap.utils.clamp(-MAGNET_REACH, MAGNET_REACH);

		gsap.to(root, {
			x: clampReach(
				(event.clientX - rect.left - rect.width / 2) * MAGNET_PULL
			),
			y: clampReach(
				(event.clientY - rect.top - rect.height / 2) * MAGNET_PULL
			),
			duration: 0.6,
			ease: 'power3.out',
			overwrite: 'auto'
		});
	};

	const leave = (event: React.PointerEvent<HTMLSpanElement>) => {
		gsap.to(event.currentTarget, {
			x: 0,
			y: 0,
			duration: 0.9,
			ease: 'elastic.out(1, 0.5)',
			overwrite: 'auto'
		});
	};

	return (
		<span
			onPointerMove={move}
			onPointerLeave={leave}
			className="inline-flex"
		>
			{children}
		</span>
	);
}

interface HeroCinematicCopyProps {
	phrases: string[];
	phraseHoldSeconds: number;
	/** The copy is on screen — start the rotating line. */
	running: boolean;
	projectCount: number;
	sinceYear: string;
	onSeeWorks: () => void;
	className?: string;
}

/**
 * The hero's copy block. Every piece the entrance animates carries a data
 * attribute — lines, words, and the trailing groups — so the hero drives one
 * timeline across all of them, scrubbed by scroll on large screens and
 * played once on small ones.
 */
export function HeroCinematicCopy({
	phrases,
	phraseHoldSeconds,
	running,
	projectCount,
	sinceYear,
	onSeeWorks,
	className
}: HeroCinematicCopyProps) {
	const subtextWords = heroCinematicCopy.subtext.split(' ');

	return (
		<div
			data-copy
			className={cn('flex flex-col items-start', className)}
		>
			<h1 className="font-heading text-[clamp(2.75rem,4.7vw,5.25rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-foreground">
				{heroCinematicCopy.headlineLines.map((line) => (
					<span
						key={line}
						className="block overflow-hidden pb-[0.06em]"
					>
						<span
							data-copy-line
							className="block whitespace-nowrap"
						>
							{line}
						</span>
					</span>
				))}
				<span className="block overflow-hidden">
					<span
						data-copy-line
						className="block font-serif text-[1.12em] leading-[1.02] font-normal tracking-[-0.01em] italic"
					>
						<RotatingPhrase
							phrases={phrases}
							holdSeconds={phraseHoldSeconds}
							running={running}
						/>
					</span>
				</span>
			</h1>

			<p className="mt-8 max-w-md text-lg leading-relaxed text-pretty text-muted-foreground dark:text-white/70">
				{subtextWords.map((word, index) => (
					<Fragment key={`${word}-${index}`}>
						<span
							data-copy-word
							className="inline-block"
						>
							{word}
						</span>{' '}
					</Fragment>
				))}
			</p>

			<div
				data-copy-reveal
				className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
			>
				<Magnetic>
					<Button
						asChild
						size="lg"
						className="h-12 rounded-full px-7 text-base"
					>
						<Link href="/contact">
							{heroCinematicCopy.primaryAction}
						</Link>
					</Button>
				</Magnetic>

				<button
					type="button"
					onClick={onSeeWorks}
					className="group inline-flex cursor-pointer items-center gap-2.5 text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
				>
					<ArrowDown className="size-4 text-primary drop-shadow-[0_0_6px_var(--color-primary)] group-hover:paused motion-safe:animate-float-cue" />
					{heroCinematicCopy.secondaryAction}
				</button>
			</div>

			<div
				data-copy-reveal
				className="mt-14 flex w-full max-w-lg flex-wrap gap-x-10 gap-y-3 border-t border-border/70 pt-6 text-sm text-muted-foreground"
			>
				<p>
					<span
						data-copy-count
						className="font-semibold text-foreground tabular-nums"
					>
						{projectCount}
					</span>{' '}
					projects shipped since {sinceYear}.
				</p>
				<p className="inline-flex items-center gap-2.5">
					<span className="relative flex size-2">
						<span className="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:animate-none" />
						<span className="relative size-2 rounded-full bg-primary" />
					</span>
					{heroCinematicCopy.availability}
				</p>
			</div>
		</div>
	);
}
