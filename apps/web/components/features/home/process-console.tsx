'use client';

import { motion, type Variants } from 'framer-motion';

import { cn } from '@workspace/ui/lib/utils';

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Every stage renders the *same* project console at a later point in its life —
 * brief, blueprint, build feed, pre-flight checks, handover pack — so the panel
 * reads as one artifact maturing rather than five unrelated illustrations.
 */
export const consoleStage: Variants = {
	hidden: { opacity: 0, y: 10 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: REVEAL_EASE, staggerChildren: 0.07 }
	},
	exit: { opacity: 0, y: -10, transition: { duration: 0.25 } }
};

const row: Variants = {
	hidden: { opacity: 0, y: 8 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: REVEAL_EASE } }
};

function Caption({ children }: { children: React.ReactNode }) {
	return (
		<motion.p
			variants={row}
			className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase"
		>
			{children}
		</motion.p>
	);
}

function Bar({ width, muted }: { width: string; muted?: boolean }) {
	return (
		<span
			className={cn(
				'block h-2 rounded-full',
				muted ? 'bg-muted-foreground/20' : 'bg-primary/60'
			)}
			style={{ width }}
		/>
	);
}

function DiscoverStage() {
	return (
		<motion.div
			variants={consoleStage}
			className="flex h-full flex-col gap-5"
		>
			<Caption>Project brief</Caption>

			<div className="flex flex-col gap-3">
				{[
					{ label: 'Current operations', width: '72%' },
					{ label: 'Pain points', width: '54%' },
					{ label: 'Growth goals', width: '86%' }
				].map((item) => (
					<motion.div
						key={item.label}
						variants={row}
						className="flex flex-col gap-1.5"
					>
						<span className="text-xs text-muted-foreground">
							{item.label}
						</span>
						<Bar width={item.width} />
					</motion.div>
				))}
			</div>

			<motion.div
				variants={row}
				className="mt-auto flex flex-col gap-2"
			>
				<span className="font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground uppercase">
					Roadmap
				</span>
				<div className="flex gap-1">
					{['Disc', 'Arch', 'Build', 'QA', 'Ship'].map((phase, i) => (
						<span
							key={phase}
							className={cn(
								'flex-1 rounded px-2 py-1.5 text-center font-mono text-[0.6rem]',
								i === 0
									? 'bg-primary/20 text-primary'
									: 'bg-muted-foreground/10 text-muted-foreground'
							)}
						>
							{phase}
						</span>
					))}
				</div>
			</motion.div>
		</motion.div>
	);
}

// Nodes are placed by their centre and the connectors are drawn to those exact
// same coordinates, so the lines always meet the boxes. The boxes paint over
// the line ends, which is what makes them read as connected.
const HUB = { x: 50, y: 50 };
const BLUEPRINT_NODES = [
	{ label: 'Client', x: 17, y: 14 },
	{ label: 'Database', x: 82, y: 14 },
	{ label: 'Auth', x: 15, y: 84 },
	{ label: 'Integrations', x: 80, y: 84 }
];

function DesignStage() {
	return (
		<motion.div
			variants={consoleStage}
			className="flex h-full flex-col gap-5"
		>
			<Caption>System blueprint</Caption>

			<div className="relative flex-1">
				<svg
					aria-hidden
					className="absolute inset-0 size-full"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
				>
					{BLUEPRINT_NODES.map((node) => (
						<motion.line
							key={node.label}
							x1={node.x}
							y1={node.y}
							x2={HUB.x}
							y2={HUB.y}
							stroke="var(--color-primary)"
							strokeWidth="0.4"
							strokeOpacity="0.55"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 0.8, ease: REVEAL_EASE }}
							vectorEffect="non-scaling-stroke"
						/>
					))}
				</svg>

				{[...BLUEPRINT_NODES, { label: 'API', ...HUB }].map((node) => (
					<div
						key={node.label}
						// Positioning lives on this wrapper: Framer Motion writes
						// an inline transform on the animated child, which would
						// wipe out a centring translate.
						className="absolute -translate-x-1/2 -translate-y-1/2"
						style={{ left: `${node.x}%`, top: `${node.y}%` }}
					>
						<motion.span
							variants={row}
							className={cn(
								'block rounded border px-2.5 py-1.5 font-mono text-[0.6rem] whitespace-nowrap',
								node.label === 'API'
									? 'border-primary/60 bg-primary/15 text-primary'
									: 'border-border bg-card text-muted-foreground'
							)}
						>
							{node.label}
						</motion.span>
					</div>
				))}
			</div>
		</motion.div>
	);
}

function BuildStage() {
	const shipped = [
		{ label: 'Auth + roles', week: 'wk 2' },
		{ label: 'Orders module', week: 'wk 4' },
		{ label: 'Reporting view', week: 'wk 6' }
	];

	return (
		<motion.div
			variants={consoleStage}
			className="flex h-full flex-col gap-5"
		>
			<Caption>Shipped this sprint</Caption>

			<div className="flex flex-col gap-2.5">
				{shipped.map((item) => (
					<motion.div
						key={item.label}
						variants={row}
						className="flex items-center gap-3 rounded border border-border bg-card px-3 py-2.5"
					>
						<span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[0.6rem] text-primary">
							✓
						</span>
						<span className="flex-1 text-xs text-foreground">
							{item.label}
						</span>
						<span className="font-mono text-[0.6rem] text-muted-foreground">
							{item.week}
						</span>
					</motion.div>
				))}
			</div>

			<motion.div
				variants={row}
				className="mt-auto flex items-end gap-1"
			>
				{[40, 65, 45, 80, 60, 95, 70, 88].map((height, i) => (
					<motion.span
						key={i}
						className="flex-1 rounded-t bg-primary/50"
						initial={{ height: 0 }}
						animate={{ height: `${height * 0.4}px` }}
						transition={{
							duration: 0.5,
							delay: i * 0.04,
							ease: REVEAL_EASE
						}}
					/>
				))}
			</motion.div>
		</motion.div>
	);
}

function LaunchStage() {
	const checks = [
		'Unit + integration tests',
		'Security audit',
		'Load & performance',
		'Accessibility pass'
	];

	return (
		<motion.div
			variants={consoleStage}
			className="flex h-full flex-col gap-5"
		>
			<Caption>Pre-flight checks</Caption>

			<div className="flex flex-col gap-2">
				{checks.map((check) => (
					<motion.div
						key={check}
						variants={row}
						className="flex items-center gap-3"
					>
						<span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-primary/60 text-[0.6rem] text-primary">
							✓
						</span>
						<span className="flex-1 text-xs text-foreground">
							{check}
						</span>
						<span className="font-mono text-[0.6rem] text-primary">
							pass
						</span>
					</motion.div>
				))}
			</div>

			<motion.div
				variants={row}
				className="mt-auto grid grid-cols-3 gap-2"
			>
				{[
					{ value: '1.2s', label: 'LCP' },
					{ value: '99.9%', label: 'Uptime' },
					{ value: '0', label: 'Criticals' }
				].map((metric) => (
					<div
						key={metric.label}
						className="rounded border border-border bg-card px-3 py-2.5"
					>
						<p className="font-heading text-lg font-semibold text-primary">
							{metric.value}
						</p>
						<p className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase">
							{metric.label}
						</p>
					</div>
				))}
			</motion.div>
		</motion.div>
	);
}

function HandoverStage() {
	const docs = [
		'Architecture guide',
		'API reference',
		'Deployment runbook',
		'Admin training recording'
	];

	return (
		<motion.div
			variants={consoleStage}
			className="flex h-full flex-col gap-5"
		>
			<Caption>Handover pack</Caption>

			<div className="flex flex-col gap-2">
				{docs.map((doc) => (
					<motion.div
						key={doc}
						variants={row}
						className="flex items-center gap-3 border-b border-border pb-2 last:border-0"
					>
						<span className="font-mono text-[0.6rem] text-primary">
							/
						</span>
						<span className="flex-1 text-xs text-foreground">
							{doc}
						</span>
						<span className="font-mono text-[0.55rem] text-muted-foreground">
							ready
						</span>
					</motion.div>
				))}
			</div>

			<motion.div
				variants={row}
				className="mt-auto rounded border border-primary/40 bg-primary/10 px-4 py-3"
			>
				<p className="font-mono text-[0.6rem] tracking-[0.15em] text-primary uppercase">
					Ownership transferred
				</p>
				<p className="mt-1 text-xs text-foreground">
					You own all code and IP — no lock-in, no dependency on us.
				</p>
			</motion.div>
		</motion.div>
	);
}

const stages = [
	DiscoverStage,
	DesignStage,
	BuildStage,
	LaunchStage,
	HandoverStage
];

export function ProcessConsole({ index }: { index: number }) {
	const Stage = stages[index] ?? DiscoverStage;

	return <Stage />;
}
