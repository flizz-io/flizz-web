'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { audienceSegments } from '@/constants/home';
import { cn } from '@workspace/ui/lib/utils';

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

const listVariants: Variants = {
	hidden: {},
	show: {
		transition: { delayChildren: 0.12, staggerChildren: 0.09 }
	}
};

const itemVariants: Variants = {
	hidden: { y: '120%' },
	show: {
		y: '0%',
		transition: { duration: 0.7, ease: REVEAL_EASE }
	}
};

export function AudienceList({ className }: { className?: string }) {
	const reduceMotion = useReducedMotion();

	return (
		<motion.ul
			// The trigger sits on the list itself, never on the clipped items:
			// an element parked outside its own `overflow-hidden` parent never
			// reports as intersecting, so it would never animate in.
			variants={reduceMotion ? undefined : listVariants}
			initial={reduceMotion ? undefined : 'hidden'}
			whileInView={reduceMotion ? undefined : 'show'}
			viewport={{ once: true, amount: 0.6 }}
			className={cn(
				// A fixed grid rather than a wrapping row: six names of very
				// different lengths break into ragged lines when centred.
				'mx-auto grid w-fit grid-cols-2 gap-x-6 gap-y-1 text-left sm:grid-cols-3 sm:gap-x-10',
				className
			)}
		>
			{audienceSegments.map((segment) => (
				<li
					key={segment}
					className="overflow-hidden py-1"
				>
					<motion.span
						variants={reduceMotion ? undefined : itemVariants}
						// Top-aligned, not centred: a name that wraps to two
						// lines would otherwise float its dot into the gap.
						className="flex items-start gap-2 text-sm text-foreground sm:text-base"
					>
						<span
							aria-hidden
							className="mt-2 size-1 shrink-0 rounded-full bg-primary sm:mt-2.5"
						/>
						{segment}
					</motion.span>
				</li>
			))}
		</motion.ul>
	);
}
