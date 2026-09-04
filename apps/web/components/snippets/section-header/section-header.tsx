import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { cn } from '@workspace/ui/lib/utils';

interface SectionHeaderProps {
	index: number;
	total?: number;
	eyebrow: string;
	title: string;
	description?: string;
	seeAllLabel?: string;
	seeAllHref?: string;
	metaInfo?: string;
	className?: string;
	sectionTagWrapperClassName?: string;
	children?: React.ReactNode;
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
	className,
	sectionTagWrapperClassName,
	children
}: SectionHeaderProps) {
	return (
		<Reveal
			className={cn(
				'flex flex-col justify-between gap-6 sm:flex-row sm:items-end',
				className
			)}
		>
			<div className={cn(sectionTagWrapperClassName)}>
				<SectionTag
					index={index}
					total={total}
					label={eyebrow}
					metaInfo={metaInfo}
				/>
				<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
					{title}
				</h2>
				{description ? (
					<p className="mt-3 text-base text-muted-foreground">
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
