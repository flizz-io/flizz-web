'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowDown, Sparkle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { heroScrollTargetId } from '@/constants/home';
import { Button } from '@workspace/ui/components/button';
import { useIsDarkTheme } from '@workspace/ui/hooks/use-is-dark-theme';

// Three.js is heavy and purely decorative — keep it out of the initial bundle.
const HeroScene = dynamic(
	() => import('./hero-scene').then((mod) => mod.HeroScene),
	{ ssr: false }
);

const container: Variants = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.12, delayChildren: 0.05 }
	}
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

export function HeroStarfield() {
	const reduceMotion = useReducedMotion();
	const isDark = useIsDarkTheme();
	const lenis = useLenis();

	function scrollToNextSection() {
		const target = document.getElementById(heroScrollTargetId);
		if (!target) return;

		// Header clearance comes from the target's own `scroll-mt-*`, which both
		// Lenis and native scrolling honour — passing an offset here too would
		// double-compensate.
		if (lenis) {
			lenis.scrollTo(target);
			return;
		}

		// Lenis is skipped for reduced-motion visitors — fall back to the
		// platform's own scrolling, which honours that preference too.
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	return (
		<section className="relative overflow-hidden">
			{/* Nebula glow sits behind the starfield so the stars read on top of it. */}
			<motion.div
				aria-hidden
				className="absolute top-1/2 left-1/2 -z-20 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[120px]"
				animate={
					reduceMotion
						? undefined
						: {
								x: [0, 40, -30, 0],
								y: [0, -30, 20, 0],
								scale: [1, 1.08, 0.96, 1]
							}
				}
				transition={{
					duration: 22,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
			/>

			{isDark ? (
				<>
					<HeroScene />
					{/* Scrim keeps the headline readable where stars are densest. */}
					<div
						aria-hidden
						className="absolute inset-0 -z-[5] bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(8,6,13,0.78)_0%,rgba(8,6,13,0.4)_55%,transparent_80%)]"
					/>
				</>
			) : (
				<div
					aria-hidden
					className="absolute inset-0 -z-10 mask-[radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent)]"
					style={{
						backgroundImage:
							'radial-gradient(var(--color-border) 1px, transparent 1px)',
						backgroundSize: '32px 32px'
					}}
				/>
			)}

			{/* The sticky header takes 4rem of document flow, so subtract it here
			    or the hero's last 4rem (and the scroll cue) fall below the fold. */}
			<div className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-6 pt-20 pb-28 text-center sm:px-10 lg:px-8">
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="mx-auto flex w-full max-w-3xl flex-col items-center"
				>
					<motion.span
						variants={item}
						className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase backdrop-blur-sm dark:text-white/75"
					>
						<Sparkle className="size-3.5 text-primary" />
						Software Engineering Partner
					</motion.span>

					<motion.h1
						variants={item}
						className="mt-7 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text font-heading text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] font-semibold tracking-tight text-balance text-transparent dark:from-white dark:to-white/85"
					>
						Your technology partner for what&apos;s{' '}
						<span className="text-primary italic">next</span>.
					</motion.h1>

					<motion.p
						variants={item}
						className="mt-7 max-w-xl text-lg text-pretty text-muted-foreground dark:text-white/70"
					>
						We build transparent, maintainable systems that give you
						freedom to pivot, scale, or switch vendors without
						starting over.
					</motion.p>

					<motion.div
						variants={item}
						className="mt-10"
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
					</motion.div>
				</motion.div>

				<motion.button
					type="button"
					onClick={scrollToNextSection}
					variants={item}
					initial="hidden"
					animate="show"
					// Centred with `mx-auto` rather than a translate, because
					// Framer Motion writes an inline `transform` that would
					// override a Tailwind translate class.
					className="group absolute inset-x-0 bottom-8 mx-auto hidden w-fit items-center gap-2.5 rounded-full border border-border bg-card/70 px-4 py-2.5 font-mono text-[0.7rem] tracking-[0.2em] text-foreground/90 uppercase backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-foreground sm:flex dark:text-white/85 dark:hover:text-white"
				>
					<motion.span
						className="flex"
						animate={reduceMotion ? undefined : { y: [0, 3, 0] }}
						transition={{
							duration: 1.6,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
					>
						<ArrowDown className="size-3.5 text-primary" />
					</motion.span>
					Scroll
				</motion.button>
			</div>
		</section>
	);
}
