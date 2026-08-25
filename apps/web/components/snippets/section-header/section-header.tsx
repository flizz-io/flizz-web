import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';

interface SectionHeaderProps {
	eyebrow: string;
	title: string;
	description?: string;
	seeAllLabel?: string;
	seeAllHref?: string;
}

export function SectionHeader({
	eyebrow,
	title,
	description,
	seeAllLabel,
	seeAllHref
}: SectionHeaderProps) {
	return (
		<Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
			<div className="max-w-xl">
				<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
					{eyebrow}
				</p>
				<h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
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
