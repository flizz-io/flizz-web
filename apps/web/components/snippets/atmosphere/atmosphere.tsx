import { cn } from '@workspace/ui/lib/utils';

/**
 * The four layers that make a section read as one continuous film: drifting
 * aurora, a lens vignette that lets the edges fall away, and grain over the
 * top. All of it is low-frequency and blurred on purpose — anything sharp back
 * here competes with the content rather than giving it somewhere to sit.
 *
 * The parent needs `relative` and `overflow-hidden`.
 */
const grainTexture =
	"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface AtmosphereProps {
	/**
	 * `quiet` drops the second bloom and thins the grain — for sections where
	 * dense content sits on top and the film has to stay under it.
	 */
	intensity?: 'full' | 'quiet';
	className?: string;
}

export function Atmosphere({ intensity = 'full', className }: AtmosphereProps) {
	const isQuiet = intensity === 'quiet';

	return (
		<span
			aria-hidden
			className={cn(
				'pointer-events-none absolute inset-0 overflow-hidden',
				className
			)}
		>
			<span
				className="absolute -top-48 right-0 h-[42rem] w-[42rem] translate-x-1/4 rounded-full blur-3xl motion-safe:animate-aurora"
				style={{
					background: `radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-primary) ${isQuiet ? 12 : 20}%, transparent), transparent 68%)`
				}}
			/>

			{!isQuiet ? (
				<span
					className="absolute -bottom-52 -left-24 h-[32rem] w-[32rem] rounded-full blur-3xl motion-safe:animate-aurora"
					style={{
						animationDelay: '-13s',
						background:
							'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 70%)'
					}}
				/>
			) : null}

			<span
				className="absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 78% 78% at 50% 45%, transparent 40%, color-mix(in oklab, var(--color-background) 85%, transparent) 100%)'
				}}
			/>

			<span
				className={cn(
					'absolute inset-0 mix-blend-soft-light',
					isQuiet ? 'opacity-[0.1]' : 'opacity-[0.18]'
				)}
				style={{
					backgroundImage: grainTexture,
					backgroundSize: '160px 160px'
				}}
			/>
		</span>
	);
}
