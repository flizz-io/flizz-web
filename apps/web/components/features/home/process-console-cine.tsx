'use client';

import { animate, motion, useMotionValue, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@workspace/ui/lib/utils';

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

const stageVariants: Variants = {
	hidden: { opacity: 0, scale: 0.98, filter: 'blur(6px)' },
	show: {
		opacity: 1,
		scale: 1,
		filter: 'blur(0px)',
		transition: {
			duration: 0.55,
			ease: REVEAL_EASE,
			staggerChildren: 0.08
		}
	},
	exit: {
		opacity: 0,
		scale: 1.02,
		filter: 'blur(6px)',
		transition: { duration: 0.3 }
	}
};

const row: Variants = {
	hidden: { opacity: 0, x: -12 },
	show: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.45, ease: REVEAL_EASE }
	}
};

/** Animates a number up to its target whenever the stage mounts. */
function CountUp({
	to,
	decimals = 0,
	suffix = ''
}: {
	to: number;
	decimals?: number;
	suffix?: string;
}) {
	const value = useMotionValue(0);
	const [display, setDisplay] = useState('0');

	useEffect(() => {
		const controls = animate(value, to, {
			duration: 1.2,
			ease: REVEAL_EASE
		});
		// Subscription callback, so this stays out of the render path.
		const unsubscribe = value.on('change', (current) =>
			setDisplay(current.toFixed(decimals))
		);

		return () => {
			controls.stop();
			unsubscribe();
		};
	}, [to, decimals, value]);

	return (
		<>
			{display}
			{suffix}
		</>
	);
}

function Caption({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			variants={row}
			className="flex items-center gap-2"
		>
			<span className="size-1.5 animate-pulse rounded-full bg-primary" />
			<p className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
				{children}
			</p>
		</motion.div>
	);
}

const intakeLines = [
	'mapped 6 core workflows',
	'flagged 3 manual bottlenecks',
	'scoped 24 requirements'
];

function DiscoverStage() {
	const signals = [
		{ label: 'Current operations', value: 72 },
		{ label: 'Pain points', value: 54 },
		{ label: 'Growth goals', value: 86 },
		{ label: 'Data readiness', value: 61 },
		{ label: 'Technical constraints', value: 45 }
	];

	return (
		<motion.div
			variants={stageVariants}
			className="flex h-full flex-col gap-5"
		>
			<Caption>Project brief</Caption>

			{/* Workshop transcript, typed in line by line — the clip comes from
			    animating width against `overflow-hidden`, so the row keeps its
			    full height from the first frame and nothing below it moves. */}
			<motion.div
				variants={row}
				className="flex flex-col gap-1.5 rounded border border-border bg-card px-3 py-2.5"
			>
				{intakeLines.map((line, i) => (
					<motion.p
						key={line}
						className="overflow-hidden font-mono text-[0.6rem] whitespace-nowrap text-muted-foreground"
						initial={{ width: 0 }}
						animate={{ width: '100%' }}
						transition={{
							duration: 0.45,
							delay: 0.25 + i * 0.4,
							ease: 'linear'
						}}
					>
						<span className="text-primary">›</span> {line}
					</motion.p>
				))}
				<motion.span
					aria-hidden
					className="block h-2.5 w-1.5 bg-primary"
					animate={{ opacity: [1, 0.1, 1] }}
					transition={{
						duration: 1.1,
						repeat: Infinity,
						ease: 'linear'
					}}
				/>
			</motion.div>

			<div className="flex flex-1 flex-col justify-between gap-3.5">
				{signals.map((signal) => (
					<motion.div
						key={signal.label}
						variants={row}
						className="flex flex-col gap-1.5"
					>
						<span className="flex items-baseline justify-between text-xs text-muted-foreground">
							{signal.label}
							<span className="font-mono text-sm text-primary">
								<CountUp
									to={signal.value}
									suffix="%"
								/>
							</span>
						</span>
						<span className="block h-1.5 overflow-hidden rounded-full bg-muted-foreground/15">
							<motion.span
								className="block h-full rounded-full bg-primary"
								initial={{ width: 0 }}
								animate={{ width: `${signal.value}%` }}
								transition={{
									duration: 1.1,
									ease: REVEAL_EASE
								}}
							/>
						</span>
					</motion.div>
				))}
			</div>

			<motion.div variants={row}>
				<div className="flex gap-1">
					{['Disc', 'Arch', 'Build', 'QA', 'Ship'].map((phase, i) => (
						<motion.span
							key={phase}
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								delay: 0.4 + i * 0.08,
								duration: 0.4
							}}
							className={cn(
								'flex-1 rounded px-2 py-1.5 text-center font-mono text-[0.6rem]',
								i === 0
									? 'bg-primary/25 text-primary'
									: 'bg-muted-foreground/10 text-muted-foreground'
							)}
						>
							{phase}
						</motion.span>
					))}
				</div>
			</motion.div>
		</motion.div>
	);
}

const HUB = { x: 50, y: 50 };
const BLUEPRINT_NODES = [
	{ label: 'Client', x: 17, y: 15 },
	{ label: 'Database', x: 82, y: 15 },
	{ label: 'Auth', x: 15, y: 83 },
	{ label: 'Integrations', x: 80, y: 83 }
];

function DesignStage() {
	return (
		<motion.div
			variants={stageVariants}
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
					{BLUEPRINT_NODES.map((node, i) => (
						<g key={node.label}>
							<motion.line
								x1={node.x}
								y1={node.y}
								x2={HUB.x}
								y2={HUB.y}
								stroke="var(--color-primary)"
								strokeWidth="0.4"
								strokeOpacity="0.35"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{
									duration: 0.8,
									delay: i * 0.1,
									ease: REVEAL_EASE
								}}
								vectorEffect="non-scaling-stroke"
							/>
							{/* Packets flowing toward the hub. */}
							<motion.line
								x1={node.x}
								y1={node.y}
								x2={HUB.x}
								y2={HUB.y}
								stroke="var(--color-primary)"
								strokeWidth="0.9"
								strokeDasharray="3 14"
								vectorEffect="non-scaling-stroke"
								animate={{ strokeDashoffset: [0, -17] }}
								transition={{
									duration: 1.4,
									repeat: Infinity,
									ease: 'linear',
									delay: i * 0.25
								}}
							/>
						</g>
					))}
				</svg>

				{[...BLUEPRINT_NODES, { label: 'API', ...HUB }].map((node) => (
					<div
						key={node.label}
						// Positioning stays on the wrapper: Framer Motion writes an
						// inline transform on the child that would clobber a
						// centring translate.
						className="absolute -translate-x-1/2 -translate-y-1/2"
						style={{ left: `${node.x}%`, top: `${node.y}%` }}
					>
						<motion.span
							variants={row}
							className={cn(
								'block rounded border px-2.5 py-1.5 font-mono text-[0.6rem] whitespace-nowrap',
								node.label === 'API'
									? 'border-primary/70 bg-primary/20 text-primary'
									: 'border-border bg-card text-muted-foreground'
							)}
						>
							{node.label}
						</motion.span>
						{node.label === 'API' ? (
							<motion.span
								aria-hidden
								className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-xl"
								animate={{ opacity: [0.4, 0.9, 0.4] }}
								transition={{
									duration: 2.4,
									repeat: Infinity,
									ease: 'easeInOut'
								}}
							/>
						) : null}
					</div>
				))}
			</div>

			<motion.div
				variants={row}
				className="flex items-center justify-between border-t border-border pt-3 font-mono text-[0.6rem] text-muted-foreground"
			>
				<span>
					<span className="text-primary">4</span> services
				</span>
				<span>
					<span className="text-primary">1</span> gateway
				</span>
				<span>
					<span className="text-primary">12</span> endpoints
				</span>
			</motion.div>
		</motion.div>
	);
}

function BuildStage() {
	const shipped = [
		{ label: 'Auth + roles', week: 'wk 2' },
		{ label: 'Orders module', week: 'wk 4' },
		{ label: 'Reporting view', week: 'wk 6' },
		{ label: 'Client portal', week: 'wk 7' }
	];
	const velocity = [40, 65, 45, 80, 60, 95, 70, 88];

	return (
		<motion.div
			variants={stageVariants}
			className="flex h-full flex-col gap-4"
		>
			<Caption>Shipped this sprint</Caption>

			<div className="flex flex-col gap-2">
				{shipped.map((item, i) => (
					<motion.div
						key={item.label}
						variants={row}
						className="relative flex items-center gap-3 overflow-hidden rounded border border-border bg-card px-3 py-2.5"
					>
						<motion.span
							aria-hidden
							className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-primary/15 to-transparent"
							initial={{ x: '-100%' }}
							animate={{ x: '600%' }}
							transition={{
								duration: 1.6,
								delay: 0.3 + i * 0.15,
								ease: 'easeInOut'
							}}
						/>
						<motion.span
							className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/25 text-[0.6rem] text-primary"
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{
								delay: 0.35 + i * 0.15,
								type: 'spring',
								stiffness: 400,
								damping: 18
							}}
						>
							✓
						</motion.span>
						<span className="flex-1 text-xs text-foreground">
							{item.label}
						</span>
						<span className="font-mono text-[0.6rem] text-muted-foreground">
							{item.week}
						</span>
					</motion.div>
				))}
			</div>

			{/* The chart takes the leftover height rather than a fixed one, so
			    the frame stays full whatever the copy above it grows to. */}
			<motion.div
				variants={row}
				className="flex min-h-0 flex-1 flex-col"
			>
				<p className="mb-2 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
					Velocity
				</p>
				<div className="flex flex-1 items-end gap-1">
					{velocity.map((height, i) => (
						<motion.span
							key={i}
							className="flex-1 rounded-t bg-primary/60"
							initial={{ height: 0 }}
							animate={{ height: `${height}%` }}
							transition={{
								duration: 0.6,
								delay: 0.3 + i * 0.06,
								ease: REVEAL_EASE
							}}
						/>
					))}
				</div>
			</motion.div>
		</motion.div>
	);
}

function LaunchStage() {
	const checks = [
		'Unit + integration tests',
		'Security audit',
		'Load & performance',
		'Accessibility pass',
		'Cross-browser QA',
		'Rollback drill'
	];

	return (
		<motion.div
			variants={stageVariants}
			className="flex h-full flex-col gap-4"
		>
			<Caption>Pre-flight checks</Caption>

			{/* Spaced out by `justify-between` and tied together by the rail, so
			    the leftover height reads as a sequence rather than a gap. */}
			<div className="relative flex flex-1 flex-col justify-between">
				<motion.span
					aria-hidden
					className="absolute top-2 bottom-2 left-2 w-px origin-top bg-border"
					initial={{ scaleY: 0 }}
					animate={{ scaleY: 1 }}
					transition={{ duration: 0.9, ease: REVEAL_EASE }}
				/>
				{checks.map((check, i) => (
					<motion.div
						key={check}
						variants={row}
						className="relative flex items-center gap-3"
					>
						<motion.span
							className="flex size-4 shrink-0 items-center justify-center rounded-full border border-primary/70 bg-card text-[0.6rem] text-primary"
							initial={{ scale: 0, rotate: -90 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{
								delay: 0.3 + i * 0.14,
								type: 'spring',
								stiffness: 380,
								damping: 16
							}}
						>
							✓
						</motion.span>
						<span className="flex-1 text-xs text-foreground">
							{check}
						</span>
						<motion.span
							className="font-mono text-[0.6rem] text-primary"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.45 + i * 0.14 }}
						>
							pass
						</motion.span>
					</motion.div>
				))}
			</div>

			<motion.div
				variants={row}
				className="grid grid-cols-3 gap-2"
			>
				{[
					{ to: 1.2, decimals: 1, suffix: 's', label: 'LCP' },
					{ to: 99.9, decimals: 1, suffix: '%', label: 'Uptime' },
					{ to: 0, decimals: 0, suffix: '', label: 'Criticals' }
				].map((metric) => (
					<div
						key={metric.label}
						className="rounded border border-border bg-card px-3 py-2.5"
					>
						<p className="font-heading text-lg font-semibold text-primary">
							<CountUp
								to={metric.to}
								decimals={metric.decimals}
								suffix={metric.suffix}
							/>
						</p>
						<p className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
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
		{ label: 'Architecture guide', kind: 'pdf' },
		{ label: 'API reference', kind: 'openapi' },
		{ label: 'Deployment runbook', kind: 'md' },
		{ label: 'Admin training recording', kind: 'mp4' },
		{ label: 'Environment credentials', kind: 'vault' },
		{ label: 'Support & escalation path', kind: 'md' }
	];

	return (
		<motion.div
			variants={stageVariants}
			className="flex h-full flex-col gap-4"
		>
			<Caption>Handover pack</Caption>

			{/* Equal-height bands rather than `justify-between`, so the leftover
			    height lands between the dividers instead of under them. */}
			<div className="flex flex-1 flex-col">
				{docs.map((doc) => (
					<motion.div
						key={doc.label}
						variants={row}
						className="flex flex-1 items-center gap-3 border-b border-border last:border-0"
					>
						<span className="font-mono text-[0.6rem] text-primary">
							/
						</span>
						<span className="flex-1 text-xs text-foreground">
							{doc.label}
						</span>
						<span className="rounded bg-muted-foreground/10 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
							{doc.kind}
						</span>
					</motion.div>
				))}
			</div>

			<motion.div
				variants={row}
				className="relative overflow-hidden rounded border border-primary/50 bg-primary/10 px-4 py-3"
			>
				<motion.span
					aria-hidden
					className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-primary/25 to-transparent"
					initial={{ x: '-120%' }}
					animate={{ x: '520%' }}
					transition={{
						duration: 2,
						delay: 0.5,
						ease: 'easeInOut'
					}}
				/>
				<p className="relative font-mono text-[0.6rem] tracking-[0.15em] text-primary uppercase">
					Ownership transferred
				</p>
				<p className="relative mt-1 text-xs text-foreground">
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

export function ProcessConsoleCine({ index }: { index: number }) {
	const Stage = stages[index] ?? DiscoverStage;

	return <Stage />;
}
