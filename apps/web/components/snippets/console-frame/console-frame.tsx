import { motion } from 'framer-motion';

import { BorderBeam } from '@workspace/ui/components/border-beam';
import { cn } from '@workspace/ui/lib/utils';

export function ConsoleFrame({
	index,
	children,
	headerTitle,
	footerContent,
	className,
	bodyClassName,
	footerClassName
}: {
	index: number;
	children: React.ReactNode;
	headerTitle?: string;
	footerContent?: React.ReactNode;
	className?: string;
	bodyClassName?: string;
	footerClassName?: string;
}) {
	return (
		<div
			className={cn(
				'relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl lg:sticky lg:top-28',
				className
			)}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-[50%] bg-primary/20 blur-3xl"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.07]"
				style={{
					backgroundImage:
						'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
					backgroundSize: '18px 18px'
				}}
			/>

			<div className="relative flex items-center gap-2 border-b border-border px-4 py-3">
				{[0, 1, 2].map((dot) => (
					<span
						key={dot}
						className="size-2 rounded-full bg-muted-foreground/30"
					/>
				))}
				<span className="ml-2 font-mono text-[0.65rem] text-muted-foreground">
					{headerTitle}
				</span>
			</div>

			<div className={cn('relative h-84 p-6', bodyClassName)}>
				{children}
			</div>

			<div
				className={cn(
					'relative flex items-center justify-between border-t border-border px-4 py-2.5',
					footerClassName
				)}
			>
				{footerContent}
			</div>

			<BorderBeam
				duration={10}
				size={300}
				className="from-transparent via-primary to-transparent"
			/>
		</div>
	);
}
