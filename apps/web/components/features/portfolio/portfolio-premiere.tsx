'use client';

import {
	AnimatePresence,
	motion,
	useAnimate,
	useMotionValue,
	useSpring,
	useTransform,
	type Variants
} from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ProjectShift } from '@/components/features/portfolio/project-shift';
import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { DotField } from '@/components/snippets/dot-field/dot-field';
import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { featuredProjects } from '@/constants/portfolio';
import { projectSectorOrder } from '@/enums/portfolio';
import { Button } from '@workspace/ui/components/button';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { cn } from '@workspace/ui/lib/utils';

interface PortfolioPremiereProps {
	sectionIndex: number;
	totalSections?: number;
	/**
	 * Run the stage edge to edge rather than inside the page's max width. On by
	 * default — a premiere fills the screen.
	 */
	fullWidth?: boolean;
	/**
	 * Fill the viewport height on desktop, the way the home Problem section
	 * does, so the picture is the whole screen. On by default. Left off on
	 * phones, where a fixed height would clip the stacked copy and plate.
	 */
	fullHeight?: boolean;
	className?: string;
}

interface Scene {
	index: number;
	/** Which way the last cut went, so the wipe and the plate travel with it. */
	direction: 1 | -1;
	/** Counts cuts. Zero on mount, so the first scene arrives without a wipe. */
	take: number;
}

/** How long a scene holds before the reel moves on by itself. */
const sceneMs = 8000;

/** Sideways travel that counts as a swipe rather than a tap. */
const swipeThreshold = 48;

/** The house easing, as a bezier for Framer. */
const powerOn = [0.16, 1, 0.3, 1] as const;

/**
 * The highlighted work in running order — sector by sector, newest first inside
 * each — the same order the other two treatments use, so switching variant
 * never reshuffles the work.
 */
const reel = projectSectorOrder.flatMap((sector) =>
	featuredProjects
		.filter((project) => project.sector === sector)
		.sort((a, b) => b.year.localeCompare(a.year))
);

const pad = (value: number) => String(value).padStart(2, '0');

const sceneVariants: Variants = {
	enter: (direction: number) => ({ opacity: 0, x: 48 * direction }),
	center: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.7,
			ease: powerOn,
			delayChildren: 0.12,
			staggerChildren: 0.08
		}
	},
	exit: (direction: number) => ({
		opacity: 0,
		x: -40 * direction,
		transition: { duration: 0.35, ease: 'easeIn' }
	})
};

const lineVariants: Variants = {
	enter: { opacity: 0, y: 18 },
	center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: powerOn } },
	exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

const plateVariants: Variants = {
	enter: (direction: number) => ({
		opacity: 0,
		x: 90 * direction,
		rotateY: -22 * direction,
		scale: 0.94
	}),
	center: {
		opacity: 1,
		x: 0,
		rotateY: 0,
		scale: 1,
		transition: { duration: 0.9, ease: powerOn }
	},
	exit: (direction: number) => ({
		opacity: 0,
		x: -70 * direction,
		rotateY: 14 * direction,
		scale: 0.96,
		transition: { duration: 0.4, ease: 'easeIn' }
	})
};

/**
 * The highlighted work as a premiere: a letterboxed stage that plays.
 *
 * Where the other two treatments present a project, this one screens it. The
 * stage sits between two black bars, the way a widescreen picture sits in a
 * frame it does not fill. Behind the plate the project's own name runs past at
 * title-card size, drawn in outline so it reads as light rather than copy. The
 * plate hangs in perspective and answers the cursor — the near layer leaning
 * with it, the title drifting against it — so the stage has depth rather than a
 * backdrop. Cuts are wipes. A timecode runs in the corner. And the reel plays on
 * by itself, with the active tick filling as the scene holds, pausing whenever
 * the visitor's hand or focus is on it.
 *
 * All of the motion is one orchestrated moment per cut; nothing else on the
 * page moves unprompted. Every piece respects the reduced-motion preference.
 */
export function PortfolioPremiere({
	sectionIndex,
	totalSections,
	fullWidth = true,
	fullHeight = true,
	className
}: PortfolioPremiereProps) {
	const reduceMotion = usePrefersReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const timecodeRef = useRef<HTMLSpanElement>(null);
	const pressRef = useRef<number | null>(null);
	const heldRef = useRef(false);

	const [scene, setScene] = useState<Scene>({
		index: 0,
		direction: 1,
		take: 0
	});
	const [inView, setInView] = useState(false);
	const [held, setHeld] = useState(false);

	const cut = useCallback(
		(target: number, direction: 1 | -1) =>
			setScene((current) => advance(current, target, direction)),
		[]
	);
	const next = useCallback(
		() => setScene((current) => advance(current, current.index + 1, 1)),
		[]
	);
	const prev = useCallback(
		() => setScene((current) => advance(current, current.index - 1, -1)),
		[]
	);

	// --- pointer parallax ----------------------------------------------------
	const pointerX = useMotionValue(0);
	const pointerY = useMotionValue(0);
	const springX = useSpring(pointerX, { stiffness: 60, damping: 18 });
	const springY = useSpring(pointerY, { stiffness: 60, damping: 18 });
	// The near layer leans with the cursor; the far one drifts against it.
	const plateX = useTransform(springX, [-1, 1], [-16, 16]);
	const plateRotateY = useTransform(springX, [-1, 1], [-7, 7]);
	const plateRotateX = useTransform(springY, [-1, 1], [5, -5]);
	const titleX = useTransform(springX, [-1, 1], [36, -36]);

	const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		const stage = stageRef.current;
		if (reduceMotion || event.pointerType !== 'mouse' || !stage) return;

		const rect = stage.getBoundingClientRect();
		pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
		pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
	};

	const settlePointer = () => {
		pointerX.set(0);
		pointerY.set(0);
	};

	// --- swipe ---------------------------------------------------------------
	const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		pressRef.current = event.clientX;
	};

	const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
		const start = pressRef.current;
		pressRef.current = null;
		if (start === null) return;

		const travelled = event.clientX - start;
		if (Math.abs(travelled) < swipeThreshold) return;

		if (travelled < 0) next();
		else prev();
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			next();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			prev();
		}
	};

	// --- autoplay: the active tick's fill is the timer ------------------------
	const autoplay = inView && !reduceMotion && reel.length > 1;
	const [fillScope, animateFill] = useAnimate();
	const playbackRef = useRef<ReturnType<typeof animateFill> | null>(null);

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => setInView(Boolean(entry?.isIntersecting)),
			{ threshold: 0.35 }
		);
		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!autoplay || !fillScope.current) return;

		let cancelled = false;
		const controls = animateFill(
			fillScope.current,
			{ scaleX: [0, 1] },
			{ duration: sceneMs / 1000, ease: 'linear' }
		);
		playbackRef.current = controls;
		// A scene that was already being held when it arrived waits too.
		if (heldRef.current) controls.pause();

		controls.then(() => {
			if (!cancelled) next();
		});

		return () => {
			cancelled = true;
			controls.stop();
			playbackRef.current = null;
		};
	}, [autoplay, scene.index, scene.take, animateFill, fillScope, next]);

	useEffect(() => {
		heldRef.current = held;
		const controls = playbackRef.current;
		if (!controls) return;

		if (held) controls.pause();
		else controls.play();
	}, [held]);

	// --- timecode ------------------------------------------------------------
	useEffect(() => {
		const node = timecodeRef.current;
		if (!node) return;

		if (reduceMotion || !inView) {
			node.textContent = '00:00:00:00';
			return;
		}

		const start = performance.now();
		let frame = 0;

		// Written straight to the node: a React render 24 times a second for a
		// counter nobody is reading closely would be paying for nothing.
		const tick = (now: number) => {
			const elapsed = now - start;
			const seconds = Math.floor(elapsed / 1000);
			const frames = Math.floor((elapsed % 1000) / (1000 / 24));
			node.textContent = `00:${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}:${pad(frames)}`;
			frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);

		return () => cancelAnimationFrame(frame);
	}, [scene.index, reduceMotion, inView]);

	const active = reel[scene.index];
	if (!active) return null;

	const result = active.results[0];
	const hold = () => setHeld(true);
	const release = () => setHeld(false);

	return (
		<section
			ref={sectionRef}
			// Forced dark whatever the theme: a screen is a dark object, and the
			// bars are black in both. `.dark` re-scopes every token beneath it.
			className={cn(
				'dark relative isolate border-t border-border outline-none',
				className
			)}
			role="region"
			aria-roledescription="carousel"
			aria-label="Highlighted work"
			tabIndex={0}
			onKeyDown={onKeyDown}
			onPointerEnter={(event) => {
				if (event.pointerType === 'mouse') hold();
			}}
			onPointerLeave={(event) => {
				if (event.pointerType === 'mouse') release();
				settlePointer();
			}}
			onFocus={hold}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget))
					release();
			}}
		>
			<Atmosphere intensity="quiet" />

			{/* A plain list of what the stage screens, for anyone reading with
			    a screen reader or a crawler — the stage itself only ever holds
			    one scene. */}
			<ul className="sr-only">
				{reel.map((project) => (
					<li key={project.slug}>
						<Link href={`/portfolio/${project.slug}`}>
							{project.name}
						</Link>
					</li>
				))}
			</ul>

			<Reveal
				className={cn(
					'relative',
					fullWidth ? 'w-full' : 'mx-auto max-w-[96rem]',
					// The whole letterbox becomes one screen: bars pinned top and
					// bottom, the picture taking the room between them.
					fullHeight && 'lg:flex lg:h-svh lg:flex-col'
				)}
			>
				{/* Top bar of the letterbox. */}
				<div className="flex items-center justify-between gap-6 bg-black px-4 py-4 sm:px-6 lg:shrink-0 lg:px-8">
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="The reel"
					/>

					<p className="flex items-center gap-5 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
						<span>
							Scene
							<span className="ml-3 text-foreground">
								{pad(scene.index + 1)}
							</span>
							<span className="mx-1.5 text-border">/</span>
							{pad(reel.length)}
						</span>
						<span
							ref={timecodeRef}
							aria-hidden
							className="hidden text-foreground/70 tabular-nums sm:inline"
						>
							00:00:00:00
						</span>
					</p>
				</div>

				{/* The picture. */}
				<div
					ref={stageRef}
					onPointerMove={onPointerMove}
					onPointerDown={onPointerDown}
					onPointerUp={onPointerUp}
					className={cn(
						'relative overflow-hidden bg-background',
						// Fill the space between the bars when the letterbox is a
						// full screen; otherwise hold a widescreen ratio.
						fullHeight
							? 'lg:min-h-0 lg:flex-1'
							: 'lg:aspect-[2.39/1]'
					)}
				>
					<DotField spacing={26} />

					{/* An anamorphic streak — the one lens artefact, and the
					    only horizontal line on a stage full of type. */}
					<span
						aria-hidden
						className="pointer-events-none absolute inset-x-0 top-[36%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
					/>
					<span
						aria-hidden
						className="pointer-events-none absolute inset-x-[8%] top-[36%] h-16 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/12 to-transparent blur-2xl"
					/>

					{/* The title card: the name at display size, outlined,
					    running past behind everything. */}
					<AnimatePresence mode="wait">
						<motion.div
							key={active.slug}
							aria-hidden
							style={{ x: reduceMotion ? 0 : titleX }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.6 }}
							className="pointer-events-none absolute inset-x-0 top-[8%] select-none lg:top-1/2 lg:-translate-y-1/2"
						>
							<motion.div
								animate={
									reduceMotion
										? undefined
										: { x: ['0%', '-50%'] }
								}
								transition={{
									duration: 34,
									ease: 'linear',
									repeat: Infinity
								}}
								className="flex w-max font-heading text-[clamp(5rem,16vw,15rem)] leading-none font-semibold tracking-tight whitespace-nowrap"
								style={{
									color: 'transparent',
									WebkitTextStroke:
										'1px color-mix(in oklab, var(--color-primary) 45%, transparent)'
								}}
							>
								<span className="pr-[0.4em]">
									{active.name}
								</span>
								<span className="pr-[0.4em]">
									{active.name}
								</span>
							</motion.div>
						</motion.div>
					</AnimatePresence>

					{/* The scene. `mode="wait"` — the outgoing scene finishes its
					    exit before the next mounts, so the entering copy always
					    plays its reveal from a clean mount. `popLayout` overlapped
					    the two and could strand the incoming scene at opacity 0
					    after a manual cut, which read as an empty stage until the
					    next scene arrived. The wipe covers the brief handover. */}
					<AnimatePresence
						mode="wait"
						initial={false}
						custom={scene.direction}
					>
						<motion.div
							key={active.slug}
							custom={scene.direction}
							variants={sceneVariants}
							initial="enter"
							animate="center"
							exit="exit"
							className="relative grid gap-10 px-5 pt-40 pb-12 sm:px-8 sm:pt-44 lg:absolute lg:inset-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14 lg:px-12 lg:py-0"
						>
							<div className="relative">
								<motion.p
									variants={lineVariants}
									className="font-mono text-sm tracking-[0.2em] text-primary uppercase"
								>
									{active.sector}
								</motion.p>

								<motion.h2
									variants={lineVariants}
									className="mt-4 font-heading text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[0.96] font-semibold tracking-tight text-balance text-foreground"
								>
									{active.name}
								</motion.h2>

								<motion.p
									variants={lineVariants}
									className="mt-5 max-w-md font-serif text-lg text-pretty text-muted-foreground italic sm:text-xl"
								>
									{active.summary}
								</motion.p>

								{result ? (
									<motion.div variants={lineVariants}>
										<ProjectShift
											result={result}
											size="lg"
											className="mt-7"
										/>
									</motion.div>
								) : null}

								<motion.div
									variants={lineVariants}
									className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
								>
									<Button
										asChild
										size="lg"
										className="h-11 px-6"
									>
										<Link
											href={`/portfolio/${active.slug}`}
										>
											Open case study
											<ArrowUpRight />
										</Link>
									</Button>

									<p className="font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
										{active.service}
										<span className="mx-2 text-border">
											·
										</span>
										{active.year}
									</p>
								</motion.div>
							</div>

							{/* The plate, in perspective. The outer layer does
							    the entrance; the inner one answers the cursor,
							    so the two never fight over one transform. */}
							<div
								className="relative"
								style={{ perspective: 1400 }}
							>
								<motion.div
									custom={scene.direction}
									variants={plateVariants}
									style={{ transformStyle: 'preserve-3d' }}
								>
									<motion.div
										style={
											reduceMotion
												? undefined
												: {
														x: plateX,
														rotateY: plateRotateY,
														rotateX: plateRotateX
													}
										}
										className="relative aspect-16/10 overflow-hidden rounded-xl border border-border bg-card shadow-[0_48px_140px_-48px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
									>
										<MediaSlot
											src={active.image}
											alt={active.name}
											label="Screenshot pending"
											sizes="(min-width: 1024px) 50vw, 100vw"
										/>

										{/* A single pass of light across the
										    plate as it lands. */}
										{!reduceMotion ? (
											<motion.span
												aria-hidden
												initial={{ x: '-140%' }}
												animate={{ x: '180%' }}
												transition={{
													duration: 1.4,
													delay: 0.35,
													ease: 'easeInOut'
												}}
												className="pointer-events-none absolute inset-y-[-20%] w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-screen"
											/>
										) : null}

										<span className="pointer-events-none absolute top-4 left-4 font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
											Scene {pad(scene.index + 1)}
										</span>
									</motion.div>
								</motion.div>
							</div>
						</motion.div>
					</AnimatePresence>

					{/* The cut. A bar of light crosses the stage in the
					    direction of travel while the scenes swap behind it;
					    it parks offscreen and is replaced on the next cut. */}
					{scene.take > 0 && !reduceMotion ? (
						<motion.span
							key={scene.take}
							aria-hidden
							initial={{
								x: scene.direction > 0 ? '-140%' : '640%'
							}}
							animate={{
								x: scene.direction > 0 ? '640%' : '-140%'
							}}
							transition={{
								duration: 0.8,
								ease: [0.7, 0, 0.3, 1]
							}}
							className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[20%] -skew-x-12 bg-gradient-to-r from-transparent via-primary/60 to-transparent blur-[2px]"
						/>
					) : null}
				</div>

				{/* Bottom bar of the letterbox: the scrubber, the transport. */}
				<div className="flex items-center justify-between gap-6 bg-black px-4 py-4 sm:px-6 lg:shrink-0 lg:px-8">
					<p className="hidden min-w-0 truncate font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase md:block">
						{active.client}
					</p>

					<nav
						aria-label="Jump to a scene"
						className="flex items-center gap-2"
					>
						{reel.map((project, index) => {
							const isActive = index === scene.index;

							return (
								<button
									key={project.slug}
									type="button"
									onClick={() =>
										cut(index, index > scene.index ? 1 : -1)
									}
									aria-label={`Scene ${pad(index + 1)}: ${project.name}`}
									aria-current={isActive}
									className="group/tick flex h-8 items-center px-1"
								>
									<span
										className={cn(
											'relative block h-px overflow-hidden transition-all duration-500',
											isActive
												? 'w-16 bg-foreground/15'
												: 'w-6 bg-foreground/20 group-hover/tick:bg-foreground/50'
										)}
									>
										{isActive ? (
											autoplay ? (
												<span
													ref={fillScope}
													className="absolute inset-0 origin-left bg-primary"
													style={{
														transform: 'scaleX(0)'
													}}
												/>
											) : (
												<span className="absolute inset-0 bg-primary" />
											)
										) : null}
									</span>
								</button>
							);
						})}
					</nav>

					<div className="flex items-center gap-2">
						{[
							{
								label: 'Previous scene',
								Icon: ArrowLeft,
								act: prev
							},
							{ label: 'Next scene', Icon: ArrowRight, act: next }
						].map(({ label, Icon, act }) => (
							<button
								key={label}
								type="button"
								onClick={act}
								aria-label={label}
								className="grid size-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
							>
								<Icon className="size-4" />
							</button>
						))}
					</div>
				</div>
			</Reveal>
		</section>
	);
}

/** One cut, as a pure step for the functional `setScene` updaters. Wraps. */
function advance(current: Scene, target: number, direction: 1 | -1): Scene {
	const index = (target + reel.length) % reel.length;
	if (index === current.index) return current;

	return { index, direction, take: current.take + 1 };
}
