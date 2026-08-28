// Temporary Hidden the States
'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Fragment } from 'react';

import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { heroScrollTargetId, socialProofLogos, stats } from '@/constants/home';

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

const ruleVariants: Variants = {
	hidden: { scaleX: 0 },
	show: { scaleX: 1, transition: { duration: 0.7, ease: REVEAL_EASE } }
};

const numeralVariants: Variants = {
	hidden: { y: '110%' },
	show: { y: '0%', transition: { duration: 0.85, ease: REVEAL_EASE } }
};

const labelVariants: Variants = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: REVEAL_EASE } }
};

const glowVariants: Variants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { duration: 1.1, ease: REVEAL_EASE } }
};

export function Proof() {
	const reduceMotion = useReducedMotion();
	const logos = [...socialProofLogos, ...socialProofLogos];

	// Every in-view trigger sits on an always-visible wrapper. A masked element
	// that starts translated outside its own overflow parent never reports as
	// intersecting, so it would never animate in.
	const inView = reduceMotion
		? {}
		: {
				initial: 'hidden' as const,
				whileInView: 'show' as const,
				viewport: { once: true, margin: '-80px' }
			};

	return (
		<section
			id={heroScrollTargetId}
			className="relative scroll-mt-24 overflow-hidden border-b border-border"
		>
			{/* The starfield ends just above, so this panel reads as the horizon
			    we descend to rather than a hard cut: a lit atmospheric rim, a
			    wide glow bleeding in from off-screen, then haze thinning out. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-52 left-1/2 hidden h-80 w-[130%] -translate-x-1/2 rounded-[50%] bg-primary/20 blur-3xl dark:bg-primary/25"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 hidden h-64 bg-gradient-to-b from-primary/[0.07] to-transparent"
			/>

			<div className="relative mx-auto hidden max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="grid sm:grid-cols-3">
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							className="relative flex flex-col items-center gap-3 px-6 py-14 text-center sm:py-16"
							{...inView}
							transition={{ delayChildren: index * 0.12 }}
						>
							{index > 0 ? (
								<span
									aria-hidden
									className="absolute top-1/2 left-0 hidden h-28 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-border to-transparent sm:block"
								/>
							) : null}

							<motion.span
								aria-hidden
								variants={ruleVariants}
								className="h-px w-10 origin-left bg-primary/70"
							/>

							{/* Numerals rise into frame behind a mask — filmic, and
							    unlike a counter it handles ranges like 30-90.
							    The emissive glow sits *outside* the mask; as a
							    drop-shadow on the text it gets clipped into a
							    hard-edged rectangle by the same overflow. */}
							<span className="relative block">
								<motion.span
									aria-hidden
									variants={glowVariants}
									className="pointer-events-none absolute inset-0 -z-10 scale-y-75 rounded-full bg-primary/25 blur-2xl"
								/>
								<span className="block overflow-hidden pb-[0.08em]">
									<motion.span
										variants={numeralVariants}
										className="block font-heading text-6xl font-semibold tracking-tight text-primary sm:text-7xl"
									>
										{stat.value}
									</motion.span>
								</span>
							</span>

							<motion.span
								variants={labelVariants}
								className="max-w-[22ch] text-sm text-muted-foreground dark:text-white/60"
							>
								{stat.label}
							</motion.span>
						</motion.div>
					))}
				</div>

				<motion.div
					aria-hidden
					className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
					initial={reduceMotion ? undefined : { scaleX: 0 }}
					whileInView={reduceMotion ? undefined : { scaleX: 1 }}
					viewport={{ once: true, margin: '-40px' }}
					transition={{ duration: 1.1, ease: REVEAL_EASE }}
				/>

				<motion.div
					className="pt-12"
					initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
					whileInView={
						reduceMotion ? undefined : { opacity: 1, y: 0 }
					}
					viewport={{ once: true, margin: '-60px' }}
					transition={{ duration: 0.6, ease: REVEAL_EASE }}
				>
					<SectionTag
						index={3}
						label="Trusted by businesses building what's next"
					/>
				</motion.div>
			</div>

			<div className="py-8">
				{/* The sweep is scoped to exactly the wordmark row — spanning the
				    section's padding as well would render it as a lit rectangle
				    rather than light falling on the logos. */}
				<div className="relative isolate overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] py-2">
					<div className="flex w-max animate-marquee items-center gap-10">
						{logos.map((logo, index) => (
							<Fragment key={`${logo}-${index}`}>
								<span className="font-heading text-2xl font-semibold whitespace-nowrap text-muted-foreground/60 dark:text-white/80">
									{logo}
								</span>
								<span
									aria-hidden
									className="size-1 shrink-0 rounded-full bg-primary/40"
								/>
							</Fragment>
						))}
					</div>

					{/* A slow light sweep briefly lifts the wordmarks out of the
					    dark — the section's one moving accent. Radial, so it has
					    falloff on every edge instead of hard vertical seams. */}
					{reduceMotion ? null : (
						<motion.div
							aria-hidden
							className="pointer-events-none absolute inset-y-0 w-1/4 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.28),transparent_70%)] mix-blend-plus-lighter"
							initial={{ x: '-130%' }}
							animate={{ x: '530%' }}
							transition={{
								duration: 3.4,
								repeat: Infinity,
								repeatDelay: 4.5,
								ease: 'easeInOut'
							}}
						/>
					)}
				</div>
			</div>
		</section>
	);
}
