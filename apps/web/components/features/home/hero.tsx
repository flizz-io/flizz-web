'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import Link from 'next/link';

import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { Button } from '@workspace/ui/components/button';

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

export function Hero() {
	const reduceMotion = useReducedMotion();

	return (
		<section className="relative overflow-hidden border-b border-border">
			<div
				aria-hidden
				className="absolute inset-0 -z-20 mask-[radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent)]"
				style={{
					backgroundImage:
						'radial-gradient(var(--color-border) 1px, transparent 1px)',
					backgroundSize: '32px 32px'
				}}
			/>
			<motion.div
				aria-hidden
				className="absolute top-1/2 left-1/2 -z-10 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[120px]"
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

			<SchematicFrame className="mx-4 my-4 flex min-h-[calc(100vh-4rem-2rem)] flex-col items-center justify-center border border-border px-6 py-20 text-center sm:mx-6 sm:px-10 lg:mx-8">
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="mx-auto flex w-full max-w-3xl flex-col items-center"
				>
					<motion.span
						variants={item}
						className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase backdrop-blur-sm"
					>
						<Sparkle className="size-3.5 text-primary" />
						Software Engineering Partner
					</motion.span>

					<motion.h1
						variants={item}
						className="mt-7 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text font-heading text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] font-semibold tracking-tight text-balance text-transparent"
					>
						Your technology partner
						<br />
						for what&apos;s{' '}
						<span className="text-primary italic">next</span>.
					</motion.h1>

					<motion.p
						variants={item}
						className="mt-7 max-w-xl text-lg text-pretty text-muted-foreground"
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

				<motion.div
					variants={item}
					initial="hidden"
					animate="show"
					className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase sm:flex"
				>
					<motion.span
						animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
						transition={{
							duration: 1.6,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
					>
						↓
					</motion.span>
					Scroll
				</motion.div>
			</SchematicFrame>
		</section>
	);
}
