import Link from 'next/link';

import { cn } from '@workspace/ui/lib/utils';

interface EmptyStateProps {
	title: string;
	description: string;
	linkLabel?: string;
	linkHref?: string;
	className?: string;
}

export function EmptyState({
	title,
	description,
	linkLabel,
	linkHref,
	className
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center',
				className
			)}
		>
			<p className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
				{title}
			</p>
			<p className="mt-2 max-w-sm text-sm text-muted-foreground">
				{description}
			</p>
			{linkLabel && linkHref ? (
				<Link
					href={linkHref}
					className="mt-4 font-mono text-xs text-primary underline-offset-4 hover:underline"
				>
					{linkLabel}
				</Link>
			) : null}
		</div>
	);
}
