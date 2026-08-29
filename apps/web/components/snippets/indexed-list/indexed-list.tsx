import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { cn } from '@workspace/ui/lib/utils';

/**
 * A bordered, numbered row list — used across the site wherever a set of
 * items reads as an index: services, process steps, FAQ-adjacent listings.
 * `IndexedList` just supplies the top border; each row staggers its own
 * reveal, so it composes with any items array the caller already has.
 */
export function IndexedList({
	children,
	className
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn('border-t border-border', className)}>
			{children}
		</div>
	);
}

interface IndexedListItemProps {
	/** 0-based position — rendered as a padded 1-based index (01, 02, …). */
	index: number;
	title: string;
	eyebrow?: string;
	description?: string;
	/** Trailing content before the arrow — tags, a date, a price. */
	meta?: React.ReactNode;
	/** Row becomes a Link when supplied; otherwise a static row (no arrow, no hover). */
	href?: string;
	revealDelay?: number;
	className?: string;
	titleClassName?: string;
	descriptionClassName?: string;
}

export function IndexedListItem({
	index,
	title,
	eyebrow,
	description,
	meta,
	href,
	revealDelay = 0,
	className,
	titleClassName,
	descriptionClassName
}: IndexedListItemProps) {
	const rowClassName = cn(
		'group flex flex-col gap-3 border-b border-border py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8',
		className
	);

	const row = (
		<>
			<div className="flex items-baseline gap-5 sm:gap-8">
				<span className="font-mono text-sm text-muted-foreground">
					{String(index + 1).padStart(2, '0')}
				</span>
				<div>
					{eyebrow ? (
						<p className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">
							{eyebrow}
						</p>
					) : null}
					<h3
						className={cn(
							'mt-1 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl',
							href &&
								'transition-colors group-hover:text-primary',
							titleClassName
						)}
					>
						{title}
					</h3>
				</div>
			</div>

			<div className="flex items-center gap-4 pl-12 sm:pl-0">
				{description ? (
					<p
						className={cn(
							'max-w-xs text-sm text-muted-foreground',
							descriptionClassName
						)}
					>
						{description}
					</p>
				) : null}
				{meta}
				{href ? (
					<ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
				) : null}
			</div>
		</>
	);

	return (
		<Reveal delay={revealDelay}>
			{href ? (
				<Link
					href={href}
					className={rowClassName}
				>
					{row}
				</Link>
			) : (
				<div className={rowClassName}>{row}</div>
			)}
		</Reveal>
	);
}
