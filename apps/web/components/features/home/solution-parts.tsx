'use client';

import {
	AnimatePresence,
	motion,
	useTransform,
	type MotionValue
} from 'framer-motion';

import { ConsoleFrame } from '@/components/snippets/console-frame/console-frame';
import { processSectionCopy, processSteps } from '@/constants/home';
import type { ProcessStep } from '@/types/home';
import { scaleTransition } from '@/utils/animation';
import { cn } from '@workspace/ui/lib/utils';

import { ProcessConsoleCine } from './process-console-cine';

/** The open row's detail slot, in px (`h-40`). Measured max content: 142px. */
const DETAIL_HEIGHT = 160;
/** How far the detail rises into place as its row opens, in px. */
const DETAIL_RISE = 10;
interface ProcessStepItemProps {
	step: ProcessStep;
	index: number;
	/** The step whose content counts as current — for semantics and focus. */
	isActive: boolean;
	/**
	 * The rail's continuous position, in steps. Each row is open by how close
	 * the position is to it, so neighbouring rows always share exactly one
	 * detail slot between them: the rail's total height never changes, even
	 * mid-hand-over, and nothing around it shifts.
	 */
	position: MotionValue<number>;
	onSelect: () => void;
	/**
	 * Tightens the row on short screens (≤ 50rem tall), for a rail that has
	 * to fit a pinned, one-screen stage.
	 */
	fitShortScreens?: boolean;
}

/**
 * One row of the process rail: the stage number and label, opening onto its
 * detail as the rail's position reaches it. Shared by both Our Process
 * variations.
 */
export function ProcessStepItem({
	step,
	index,
	isActive,
	position,
	onSelect,
	fitShortScreens = false
}: ProcessStepItemProps) {
	const open = useTransform(position, (value) =>
		Math.min(1, Math.max(0, 1 - Math.abs(value - index)))
	);
	const height = useTransform(open, [0, 1], [0, DETAIL_HEIGHT]);
	// The words trail the slot a little, so they never show half-clipped.
	const detailOpacity = useTransform(open, [0.35, 1], [0, 1]);
	const detailY = useTransform(open, [0, 1], [DETAIL_RISE, 0]);
	const number = String(index + 1).padStart(2, '0');

	return (
		<li className="border-b border-border last:border-0">
			<button
				type="button"
				onClick={onSelect}
				aria-current={isActive}
				className={cn(
					'group flex w-full cursor-pointer items-baseline gap-4 py-4 text-left',
					fitShortScreens && '[@media(max-height:50rem)]:py-2.5'
				)}
			>
				{/* Two layers rather than a colour tween, for the number and
				    the label alike: the resting text and a primary copy over
				    it, faded in by how open the row is. */}
				<span className="relative font-mono text-xs text-muted-foreground/50">
					{number}
					<motion.span
						aria-hidden
						className="absolute inset-0 text-primary"
						style={{ opacity: open }}
					>
						{number}
					</motion.span>
				</span>
				<span
					className={cn(
						'relative font-heading text-3xl font-semibold tracking-tight sm:text-4xl',
						fitShortScreens && '[@media(max-height:50rem)]:text-3xl'
					)}
				>
					<span className="text-foreground opacity-25 transition-opacity duration-300 group-hover:opacity-50">
						{step.shortLabel}
					</span>
					<motion.span
						aria-hidden
						className="absolute inset-0 text-primary"
						style={{ opacity: open }}
					>
						{step.shortLabel}
					</motion.span>
				</span>
			</button>

			<motion.div
				aria-hidden={!isActive}
				className="overflow-hidden"
				style={{ height }}
			>
				<motion.div
					className="h-40 pb-6 pl-10"
					style={{ opacity: detailOpacity, y: detailY }}
				>
					<p className="font-heading text-lg font-semibold text-foreground">
						{step.title}
					</p>
					<p className="mt-2 max-w-md text-base text-muted-foreground">
						{step.compactDescription}
					</p>
					<p className="mt-3 font-mono text-sm text-primary">
						What you get — {step.whatYouGet}
					</p>
				</motion.div>
			</motion.div>
		</li>
	);
}

/**
 * The console for the active stage: its cinematic mock, a soft scan sweep on
 * every change, and the stage count in the footer. Stages cross-fade — the
 * outgoing one is layered over and still leaving while the next arrives — so
 * the frame is never empty between them. Shared by both variations.
 */
export function ProcessConsole({ activeIndex }: { activeIndex: number }) {
	const activeStep = processSteps[activeIndex];

	return (
		<ConsoleFrame
			headerTitle={processSectionCopy.consoleTitle}
			footerContent={
				<>
					<span className="font-mono text-sm tracking-[0.2em] text-primary uppercase">
						{String(activeIndex + 1).padStart(2, '0')} /{' '}
						{activeStep?.shortLabel}
					</span>
					<span className="flex gap-1.5">
						{processSteps.map((step, i) => (
							<span
								key={step.title}
								className={cn(
									'h-1 rounded-full transition-all duration-700 ease-power-on',
									i === activeIndex
										? 'w-6 bg-primary'
										: 'w-1.5 bg-muted-foreground/30'
								)}
							/>
						))}
					</span>
				</>
			}
		>
			<div className="relative h-full">
				<AnimatePresence initial={false}>
					<motion.div
						key={activeIndex}
						initial="hidden"
						animate="show"
						exit="exit"
						className="absolute inset-0"
					>
						{/* One soft scan sweep per stage change. */}
						<motion.span
							aria-hidden
							className="pointer-events-none absolute inset-x-0 z-10 h-24 bg-linear-to-b from-transparent via-primary/8 to-transparent"
							initial={{ y: '-100%', opacity: 0.7 }}
							animate={{ y: '420%', opacity: 0 }}
							transition={scaleTransition({
								duration: 1.4,
								ease: 'easeInOut'
							})}
						/>
						<ProcessConsoleCine index={activeIndex} />
					</motion.div>
				</AnimatePresence>
			</div>
		</ConsoleFrame>
	);
}
