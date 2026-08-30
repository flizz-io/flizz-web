'use client';

import { motion } from 'framer-motion';

import type { RealCostDiagram } from '@/types/home';

/**
 * A moving figure for each line of the real cost. Each one plays out the
 * sentence it sits beside: motion that gets pulled back, a lane you never
 * catch up on, options going dark, work that bounces off its own tooling.
 */

function Diagram({ children }: { children: React.ReactNode }) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 56 32"
			className="h-14 w-28 shrink-0 text-foreground/70 sm:h-16 sm:w-32"
		>
			{children}
		</svg>
	);
}

/** Reaches forward, runs out of tether, gets dragged home. Repeat. */
function HeldBackDiagram({ active }: { active: boolean }) {
	const travel = { x: [0, 26, 26, 0, 0] };
	const timing = {
		duration: 3.6,
		times: [0, 0.5, 0.62, 0.72, 1],
		repeat: Infinity,
		ease: 'easeInOut' as const
	};

	return (
		<Diagram>
			<line
				x1="8"
				y1="16"
				x2="52"
				y2="16"
				stroke="currentColor"
				strokeWidth="0.7"
				strokeDasharray="2 2"
				strokeOpacity="0.35"
			/>
			<line
				x1="8"
				y1="9"
				x2="8"
				y2="23"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeOpacity="0.55"
			/>
			<motion.line
				x1="8"
				y1="16"
				y2="16"
				x2="14"
				stroke="var(--color-primary)"
				strokeWidth="1.2"
				strokeOpacity="0.6"
				animate={active ? { x2: [14, 40, 40, 14, 14] } : undefined}
				transition={timing}
			/>
			<motion.g
				animate={active ? travel : undefined}
				transition={timing}
			>
				<circle
					cx="14"
					cy="16"
					r="3.1"
					fill="var(--color-primary)"
				/>
			</motion.g>
		</Diagram>
	);
}

/** One lane clears the frame. The other never gets going. */
function MissedDiagram({ active }: { active: boolean }) {
	return (
		<Diagram>
			<line
				x1="4"
				y1="10"
				x2="52"
				y2="10"
				stroke="currentColor"
				strokeWidth="0.7"
				strokeOpacity="0.28"
			/>
			<line
				x1="4"
				y1="23"
				x2="52"
				y2="23"
				stroke="currentColor"
				strokeWidth="0.7"
				strokeOpacity="0.28"
			/>

			<motion.g
				animate={active ? { x: [0, 46] } : undefined}
				transition={{
					duration: 2.8,
					repeat: Infinity,
					ease: 'linear'
				}}
			>
				<circle
					cx="6"
					cy="10"
					r="2.9"
					fill="var(--color-primary)"
				/>
			</motion.g>

			<motion.g
				animate={active ? { x: [0, 9, 8, 9.5, 8.5, 9] } : undefined}
				transition={{
					duration: 2.8,
					repeat: Infinity,
					ease: 'easeOut'
				}}
			>
				<circle
					cx="6"
					cy="23"
					r="2.9"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.1"
					strokeOpacity="0.65"
				/>
			</motion.g>
		</Diagram>
	);
}

const BRANCHES = [
	'M 18 16 L 46 5',
	'M 18 16 L 49 12',
	'M 18 16 L 49 20',
	'M 18 16 L 46 27'
];

/** Four ways forward; three of them keep going dark. */
function ForkedDiagram({ active }: { active: boolean }) {
	return (
		<Diagram>
			<line
				x1="4"
				y1="16"
				x2="18"
				y2="16"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeOpacity="0.6"
			/>
			{BRANCHES.map((branch, index) => {
				const survives = index === 2;

				return (
					<motion.path
						key={branch}
						d={branch}
						fill="none"
						strokeWidth="1.1"
						stroke={
							survives ? 'currentColor' : 'var(--color-primary)'
						}
						strokeOpacity={survives ? 0.5 : 0.85}
						animate={
							active && !survives
								? { strokeOpacity: [0.85, 0.85, 0.06, 0.85] }
								: undefined
						}
						transition={{
							duration: 4,
							times: [0, 0.3, 0.62, 1],
							repeat: Infinity,
							delay: index * 0.18,
							ease: 'easeInOut'
						}}
					/>
				);
			})}
		</Diagram>
	);
}

const FRICTION_LANES = [9, 16, 23];

/** Work goes out, hits the tooling, comes back. */
function FrictionDiagram({ active }: { active: boolean }) {
	return (
		<Diagram>
			<line
				x1="40"
				y1="4"
				x2="40"
				y2="28"
				stroke="var(--color-primary)"
				strokeWidth="1.3"
				strokeOpacity="0.55"
				strokeDasharray="2 1.6"
			/>
			{FRICTION_LANES.map((lane, index) => (
				<g key={lane}>
					<line
						x1="6"
						y1={lane}
						x2="40"
						y2={lane}
						stroke="currentColor"
						strokeWidth="0.6"
						strokeOpacity="0.25"
					/>
					<motion.g
						animate={active ? { x: [0, 28, 28, 0] } : undefined}
						transition={{
							duration: 2.8,
							times: [0, 0.42, 0.5, 0.78],
							repeat: Infinity,
							delay: index * 0.45,
							ease: 'easeInOut'
						}}
					>
						<rect
							x="6"
							y={lane - 1.6}
							width="5.6"
							height="3.8"
							rx="0.8"
							fill="currentColor"
							fillOpacity="0.55"
						/>
					</motion.g>
				</g>
			))}
		</Diagram>
	);
}

export function CostDiagram({
	kind,
	active
}: {
	kind: RealCostDiagram;
	active: boolean;
}) {
	switch (kind) {
		case 'held-back':
			return <HeldBackDiagram active={active} />;
		case 'missed':
			return <MissedDiagram active={active} />;
		case 'forked':
			return <ForkedDiagram active={active} />;
		default:
			return <FrictionDiagram active={active} />;
	}
}
