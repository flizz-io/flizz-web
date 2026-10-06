import { cn } from '@workspace/ui/lib/utils';

interface SeoCounterProps {
	length: number;
	max: number;
	/** Past where search results cut it, or too short to fill the snippet. */
	warn: boolean;
}

/** "58 / 70", red once search results would cut it. */
export function SeoCounter({ length, max, warn }: SeoCounterProps) {
	return (
		<span className={cn(warn && 'font-medium text-destructive')}>
			{length} / {max}
		</span>
	);
}
