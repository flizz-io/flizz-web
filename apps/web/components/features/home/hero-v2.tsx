'use client';

import { motion, type Variants } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowDown, Sparkle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { heroScrollTargetId } from '@/constants/home';
import { Button } from '@workspace/ui/components/button';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { Particles } from '@workspace/ui/components/particles';

// Three.js is heavy — keep it out of the initial bundle.
const HeroDisciplinesScene = dynamic(
	() =>
		import('./hero-disciplines-scene').then(
			(mod) => mod.HeroDisciplinesScene
		),
	{ ssr: false }
);

const container: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};

const item: Variants = {
	hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
	show: {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
	}
};

/**
 * Alternate hero: the copy holds one side and the practice itself turns on the
 * other, rather than sitting centred over a full-bleed field. Same message,
 * read as a split rather than a title card.
 */
export function HeroV2() {
	const reduceMotion = usePrefersReducedMotion();
	const lenis = useLenis();

	const scrollToNext = () => {
		const target = document.getElementById(heroScrollTargetId);
		if (!target) return;

		// Header clearance comes from the target's own `scroll-mt-*`.
		if (lenis) {
			lenis.scrollTo(target);
			return;
		}

		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	return (
		<section className="relative overflow-hidden">
			{/* Atmosphere, in three soft layers. All of it is blurred and
			    low-frequency on purpose: the constellation is crisp lines and
			    points, so anything sharp back here would compete with it
			    rather than give it somewhere to sit. */}
			<span
				aria-hidden
				className="pointer-events-none absolute top-1/2 right-0 h-[46rem] w-[46rem] translate-x-1/4 -translate-y-1/2 rounded-full blur-3xl motion-safe:animate-aurora"
				style={{
					background:
						'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 68%)'
				}}
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute -bottom-40 left-0 h-[34rem] w-[34rem] rounded-full blur-3xl motion-safe:animate-aurora"
				style={{
					animationDelay: '-13s',
					background:
						'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 70%)'
				}}
			/>

			{/* Framing: the edges fall away the way a lens would. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 78% 78% at 50% 45%, transparent 40%, color-mix(in oklab, var(--color-background) 85%, transparent) 100%)'
				}}
			/>

			{/* Film grain — the one texture that reads as cinematic without
			    putting a second geometry into the frame. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-soft-light"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
					backgroundSize: '160px 160px'
				}}
			/>

			<Particles
				className="pointer-events-none absolute inset-0 z-0"
				quantity={100}
				ease={80}
				color="#ffffff"
				refresh
			/>

			<div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl grid-cols-1 items-center gap-12 px-4 pt-20 pb-28 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:px-8">
				<motion.div
					variants={reduceMotion ? undefined : container}
					initial={reduceMotion ? undefined : 'hidden'}
					animate={reduceMotion ? undefined : 'show'}
					className="flex flex-col items-start"
				>
					<motion.span
						variants={reduceMotion ? undefined : item}
						className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase backdrop-blur-sm dark:text-white/75"
					>
						<Sparkle className="size-3.5 text-primary" />
						Software Engineering Partner
					</motion.span>

					<motion.h1
						variants={reduceMotion ? undefined : item}
						className="mt-7 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text font-heading text-[clamp(2.5rem,5.2vw,4.5rem)] leading-[1] font-semibold tracking-tight text-balance text-transparent dark:from-white dark:to-white/85"
					>
						Your technology partner for what&apos;s{' '}
						<span className="text-primary italic">next</span>.
					</motion.h1>

					<motion.p
						variants={reduceMotion ? undefined : item}
						className="mt-7 max-w-lg text-lg text-pretty text-muted-foreground dark:text-white/70"
					>
						We build transparent, maintainable systems that give you
						freedom to pivot, scale, or switch vendors without
						starting over.
					</motion.p>

					<motion.div
						variants={reduceMotion ? undefined : item}
						className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
					>
						<Button
							asChild
							size="lg"
							className="h-11 px-6 text-base"
						>
							<Link href="/contact">
								Schedule a Discovery Call →
							</Link>
						</Button>

						<button
							type="button"
							onClick={scrollToNext}
							className="group inline-flex items-center gap-2.5 font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary"
						>
							<ArrowDown className="size-3.5 text-primary transition-transform group-hover:translate-y-0.5" />
							See the work
						</button>
					</motion.div>
				</motion.div>

				{/* Square so the constellation never distorts, and the labels
				    it projects stay inside the frame at every breakpoint. */}
				<div className="relative aspect-square w-full max-w-xl justify-self-center lg:max-w-none">
					<HeroDisciplinesScene />
				</div>
			</div>
		</section>
	);
}
