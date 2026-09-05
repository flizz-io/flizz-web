import { cn } from '@workspace/ui/lib/utils';

import { Reveal } from '../reveal/reveal';

interface SectionTagProps {
	index: number;
	label: string;
	total?: number;
	className?: string;
	metaInfo?: string;
}

export function SectionTag({
	index,
	label,
	total = 12,
	className,
	metaInfo
}: SectionTagProps) {
	return (
		<Reveal className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
			<p
				className={cn(
					'font-mono text-base tracking-[0.2em] uppercase',
					className
				)}
			>
				<span className="text-muted-foreground">
					{String(index).padStart(2, '0')} /{' '}
					{String(total).padStart(2, '0')}
				</span>
				<span className="mx-2 text-muted-foreground">—</span>
				<span className="text-primary">{label}</span>
			</p>
			{metaInfo && (
				<p className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase sm:text-base">
					{metaInfo}
				</p>
			)}
		</Reveal>
	);
}
