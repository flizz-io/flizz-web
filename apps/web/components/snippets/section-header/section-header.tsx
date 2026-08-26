import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';

interface SectionHeaderProps {
	index: number;
	eyebrow: string;
	title: string;
	description?: string;
	seeAllLabel?: string;
	seeAllHref?: string;
}

export function SectionHeader({
	index,
	eyebrow,
	title,
	description,
	seeAllLabel,
	seeAllHref
}: SectionHeaderProps) {
	return (
		<Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
			<div className="max-w-xl">
				<SectionTag
					index={index}
					label={eyebrow}
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
		</Reveal>
	);
}
