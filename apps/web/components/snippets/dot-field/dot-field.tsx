import { cn } from '@workspace/ui/lib/utils';

interface DotFieldProps {
	/** Grid spacing in pixels. */
	spacing?: number;
	/** Fades the field out at the edges rather than running it to the border. */
	masked?: boolean;
	className?: string;
}

const edgeMask =
	'radial-gradient(ellipse 70% 70% at 50% 40%, #000, transparent 78%)';

/**
 * A measured dot grid — the site's other texture, and the counterpart to
 * `Atmosphere`. Where that one drifts and blooms, this one holds still, so a
 * section using it reads as a different material from one using the aurora
 * rather than as more of the same frame.
 *
 * The parent needs `relative` and `overflow-hidden`.
 */
export function DotField({
	spacing = 22,
	masked = true,
	className
}: DotFieldProps) {
	return (
		<span
			aria-hidden
			className={cn(
				'pointer-events-none absolute inset-0 opacity-[0.06]',
				className
			)}
			style={{
				backgroundImage:
					'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
				backgroundSize: `${spacing}px ${spacing}px`,
				maskImage: masked ? edgeMask : undefined,
				WebkitMaskImage: masked ? edgeMask : undefined
			}}
		/>
	);
}
