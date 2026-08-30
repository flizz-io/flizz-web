'use client';

import { motion } from 'framer-motion';

import { cn } from '@workspace/ui/lib/utils';

/**
 * Backgrounds for the pinned Problem stages. Each one is a diagram of the
 * failure it sits behind rather than decoration — a grid nothing fits, a graph
 * with no owner, a plan that keeps slipping — so the artwork argues the same
 * point the copy does.
 */

const VIEW_BOX = '0 0 160 90';

const GRID_COLUMNS = 20;
const GRID_ROWS = 12;
const CELL_WIDTH = 8;
const CELL_HEIGHT = 7.5;

/** The shape of a real business process: not a rectangle, and not on the grid. */
// Sits right of centre, clear of the mask that opens up behind the copy.
const PROCESS_OUTLINE = 'M 86 30 L 120 25 L 136 38 L 132 57 L 108 65 L 90 56 Z';

const CLASH_POINTS = [
	{ x: 120, y: 25 },
	{ x: 136, y: 38 },
	{ x: 108, y: 65 }
];

function Scene({
	children,
	className
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<svg
			aria-hidden
			viewBox={VIEW_BOX}
			preserveAspectRatio="xMidYMid slice"
			className={cn('absolute inset-0 size-full', className)}
		>
			{children}
		</svg>
	);
}

function RigidGridScene({ active }: { active: boolean }) {
	const cells = Array.from(
		{ length: GRID_COLUMNS * GRID_ROWS },
		(unused, cell) => ({
			x: (cell % GRID_COLUMNS) * CELL_WIDTH + 0.5,
			y: Math.floor(cell / GRID_COLUMNS) * CELL_HEIGHT + 0.5
		})
	);

	return (
		<Scene>
			{cells.map((cell) => (
				<rect
					key={`${cell.x}-${cell.y}`}
					x={cell.x}
					y={cell.y}
					width={CELL_WIDTH - 1}
					height={CELL_HEIGHT - 1}
					rx="0.4"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.12"
					strokeOpacity="0.45"
				/>
			))}

			{/* Nudged back and forth forever, never landing on the grid. */}
			<motion.g
				style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
				animate={
					active ? { rotate: [-9, -13, -9], x: [0, 3, 0] } : undefined
				}
				transition={{
					duration: 11,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
			>
				<path
					d={PROCESS_OUTLINE}
					fill="var(--color-primary)"
					fillOpacity="0.06"
					stroke="var(--color-primary)"
					strokeWidth="0.5"
					strokeDasharray="2.5 2"
				/>
				{CLASH_POINTS.map((point) => (
					<motion.g
						key={`${point.x}-${point.y}`}
						stroke="var(--color-primary)"
						strokeWidth="0.5"
						animate={
							active ? { opacity: [0.2, 1, 0.2] } : undefined
						}
						transition={{
							duration: 2.6,
							repeat: Infinity,
							delay: point.x / 60,
							ease: 'easeInOut'
						}}
					>
						<line
							x1={point.x - 1.6}
							y1={point.y - 1.6}
							x2={point.x + 1.6}
							y2={point.y + 1.6}
						/>
						<line
							x1={point.x + 1.6}
							y1={point.y - 1.6}
							x2={point.x - 1.6}
							y2={point.y + 1.6}
						/>
					</motion.g>
				))}
			</motion.g>
		</Scene>
	);
}

const SCATTERED_NODES = [
	{ x: 26, y: 20, drift: 2.5 },
	{ x: 62, y: 14, drift: -2 },
	{ x: 116, y: 22, drift: 3 },
	{ x: 142, y: 48, drift: 2 },
	{ x: 100, y: 60, drift: -2.5 },
	{ x: 54, y: 70, drift: 2.2 },
	{ x: 18, y: 54, drift: -3 }
];

// Deliberately partial and deliberately hub-less: the Solution section draws
// the same graph with an owner in the middle.
const SCATTERED_LINKS: [number, number][] = [
	[0, 1],
	[1, 2],
	[2, 3],
	[4, 5],
	[5, 6],
	[0, 6],
	[1, 4]
];

function ScatteredScene({ active }: { active: boolean }) {
	return (
		<Scene>
			{SCATTERED_LINKS.map(([from, to], link) => {
				const start = SCATTERED_NODES[from];
				const end = SCATTERED_NODES[to];
				if (!start || !end) return null;

				return (
					<motion.line
						key={`${from}-${to}`}
						x1={start.x}
						y1={start.y}
						x2={end.x}
						y2={end.y}
						stroke="currentColor"
						strokeWidth="0.2"
						strokeDasharray="1.5 2.5"
						// Handoffs that keep dropping out.
						animate={
							active
								? {
										strokeOpacity: [
											0.45, 0.04, 0.35, 0.06, 0.45
										]
									}
								: undefined
						}
						transition={{
							duration: 5 + link * 0.9,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
					/>
				);
			})}

			{SCATTERED_NODES.map((node) => (
				<motion.g
					key={`${node.x}-${node.y}`}
					animate={
						active
							? {
									x: [0, node.drift, 0],
									y: [0, node.drift * -0.6, 0]
								}
							: undefined
					}
					transition={{
						duration: 13,
						repeat: Infinity,
						ease: 'easeInOut'
					}}
				>
					<circle
						cx={node.x}
						cy={node.y}
						r="2.2"
						fill="none"
						stroke="currentColor"
						strokeWidth="0.25"
						strokeOpacity="0.6"
					/>
					<circle
						cx={node.x}
						cy={node.y}
						r="0.5"
						fill="var(--color-primary)"
						fillOpacity="0.5"
					/>
				</motion.g>
			))}
		</Scene>
	);
}

const TIMELINE_BARS = [
	{ y: 20, width: 42, slip: 20 },
	{ y: 33, width: 58, slip: 14 },
	{ y: 46, width: 34, slip: 26 },
	{ y: 59, width: 64, slip: 12 },
	{ y: 72, width: 47, slip: 22 }
];

function SlippingScene({ active }: { active: boolean }) {
	return (
		<Scene>
			{TIMELINE_BARS.map((bar, index) => (
				<motion.rect
					key={bar.y}
					x="18"
					y={bar.y}
					height="3"
					rx="1.5"
					fill="currentColor"
					fillOpacity="0.16"
					initial={false}
					animate={
						active
							? { width: [bar.width, bar.width + bar.slip] }
							: undefined
					}
					width={bar.width}
					transition={{
						duration: 7 + index * 1.3,
						repeat: Infinity,
						repeatType: 'reverse',
						ease: 'easeInOut'
					}}
				/>
			))}

			{/* The date everyone agreed on, walking away from the plan. */}
			<motion.g
				animate={active ? { x: [0, 46] } : undefined}
				transition={{
					duration: 16,
					repeat: Infinity,
					repeatType: 'reverse',
					ease: 'easeInOut'
				}}
			>
				<line
					x1="96"
					y1="12"
					x2="96"
					y2="82"
					stroke="var(--color-primary)"
					strokeWidth="0.4"
					strokeDasharray="2 2"
					strokeOpacity="0.8"
				/>
				<circle
					cx="96"
					cy="12"
					r="1"
					fill="var(--color-primary)"
					fillOpacity="0.8"
				/>
			</motion.g>
		</Scene>
	);
}

export function ProblemScene({
	scene,
	active
}: {
	scene: 'grid' | 'scattered' | 'slipping' | 'cost' | 'none';
	active: boolean;
}) {
	switch (scene) {
		case 'grid':
			return <RigidGridScene active={active} />;
		case 'scattered':
			return <ScatteredScene active={active} />;
		case 'slipping':
			return <SlippingScene active={active} />;
		default:
			return null;
	}
}
