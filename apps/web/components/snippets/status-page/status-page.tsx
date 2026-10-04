import type { ReactNode } from 'react';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { cn } from '@workspace/ui/lib/utils';

interface StatusPageProps {
	/** The HTTP status, set as the page's oversized backdrop numeral. */
	code: string;
	title: string;
	lead: string;
	/** Buttons and links below the lead. */
	children?: ReactNode;
	className?: string;
}

/**
 * The frame for 404 and error pages: the status code set huge and faint
 * behind the message, so the page says what happened before it's read.
 */
export function StatusPage({
	code,
	title,
	lead,
	children,
	className
}: StatusPageProps) {
	return (
		<section
			className={cn(
				'relative isolate -mt-16 flex min-h-[80svh] items-center overflow-hidden px-4 sm:px-6 lg:px-8',
				className
			)}
		>
			<Atmosphere intensity="quiet" />
			<span
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 text-center font-heading text-[clamp(10rem,32vw,26rem)] leading-none font-semibold tracking-tighter text-foreground/[0.04] select-none"
			>
				{code}
			</span>

			<div className="relative mx-auto w-full max-w-3xl pt-32 pb-20">
				<h1 className="font-heading text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-tight text-balance text-foreground">
					{title}
				</h1>
				<p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
					{lead}
				</p>
				{children}
			</div>
		</section>
	);
}
