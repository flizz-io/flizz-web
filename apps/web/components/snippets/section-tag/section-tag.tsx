import { cn } from '@workspace/ui/lib/utils';

interface SectionTagProps {
	index: number;
	label: string;
	total?: number;
	className?: string;
}

export function SectionTag({
	index,
	label,
	total = 10,
	className
}: SectionTagProps) {
	return (
		<p
			className={cn(
				'font-mono text-xs tracking-[0.2em] uppercase',
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
	);
}
