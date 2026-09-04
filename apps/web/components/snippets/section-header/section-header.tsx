import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { cn } from '@workspace/ui/lib/utils';

interface SectionHeaderProps {
	index: number;
	total?: number;
	eyebrow: string;
	/**
	 * Takes a node rather than a string so a headline can carry an accent
	 * phrase without the section reaching for its own `<h2>` — which is how the
	 * type drifted apart in the first place.
	 */
	title: ReactNode;
	description?: ReactNode;
	seeAllLabel?: string;
	seeAllHref?: string;
	metaInfo?: string;
	/**
	 * `center` stacks the block down the middle, for the sections built as a
	 * statement rather than as the top of a column of content.
	 */
	align?: 'start' | 'center';
	titleClassName?: string;
	className?: string;
	sectionTagWrapperClassName?: string;
	descriptionClassName?: string;
	children?: ReactNode;
}

export function SectionHeader({
	index,
	total,
	eyebrow,
	title,
	description,
	seeAllLabel,
	seeAllHref,
	metaInfo,
	align = 'start',
	className,
	titleClassName,
	sectionTagWrapperClassName,
	descriptionClassName,
	children
}: SectionHeaderProps) {
	const isCentered = align === 'center';

	return (
		<Reveal
			className={cn(
				'flex flex-col justify-between gap-6 sm:flex-row sm:items-end',
				isCentered && 'items-center sm:flex-col sm:items-center',
				className
			)}
		>
			<div
				className={cn(
					isCentered && 'flex flex-col items-center text-center',
					sectionTagWrapperClassName
				)}
			>
				<SectionTag
					index={index}
					total={total}
					label={eyebrow}
					metaInfo={metaInfo}
				/>
				<h2
					className={cn(
						titleClassName,
						'mt-4 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl'
					)}
				>
					{title}
				</h2>
				{description ? (
					<p
						className={cn(
							'mt-3 text-base text-pretty text-muted-foreground',
							descriptionClassName
						)}
					>
						{description}
					</p>
				) : null}
			</div>
			{seeAllLabel && seeAllHref ? (
				<Link
					href={seeAllHref}
					className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-sm text-foreground underline-offset-4 hover:text-primary hover:underline"
				>
					{seeAllLabel}
					<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</Link>
			) : null}
			{children}
		</Reveal>
	);
}
