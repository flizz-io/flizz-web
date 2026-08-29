import { Reveal } from '@/components/snippets/reveal/reveal';
import { stats } from '@/constants/home';
import { NumberTicker } from '@workspace/ui/components/number-ticker';
import { cn } from '@workspace/ui/lib/utils';

/**
 * An unnumbered band between Why Flizzio and Our Process — a breath between
 * two heavy sections rather than a section competing with them, which is why
 * it carries no section tag.
 *
 * Numerals rise from behind a clip edge rather than counting up: a count can't
 * animate a range like 30–90 or a figure we don't have yet, and one reveal
 * that works for every value keeps the row moving as a single gesture.
 */
export function StatsBand({ className }: { className?: string }) {
	return (
		<section
			className={cn(
				'relative overflow-hidden border-y border-border py-20 sm:py-24',
				className
			)}
		>
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.05]"
				style={{
					backgroundImage:
						'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
					backgroundSize: '22px 22px',
					maskImage:
						'radial-gradient(ellipse 80% 60% at 50% 50%, #000, transparent 78%)',
					WebkitMaskImage:
						'radial-gradient(ellipse 80% 60% at 50% 50%, #000, transparent 78%)'
				}}
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 h-40"
				style={{
					background:
						'radial-gradient(ellipse 50% 100% at 50% 0%, color-mix(in oklab, var(--color-primary) 9%, transparent), transparent 72%)'
				}}
			/>

			<div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-4">
					{stats.map((stat, index) => (
						<Reveal
							key={stat.label}
							delay={index * 90}
							className="relative lg:px-6"
						>
							{index > 0 ? (
								<span
									aria-hidden
									className="pointer-events-none absolute top-1/2 left-0 hidden h-24 w-px -translate-y-1/2 bg-linear-to-b from-transparent via-border to-transparent lg:block"
								/>
							) : null}

							{/* The clip the numeral rises out of. */}
							<dt className="overflow-hidden pb-[0.06em]">
								<span
									className={cn(
										'block translate-y-full font-serif text-6xl leading-none transition-transform duration-[900ms] ease-power-on group-data-[revealed=true]/reveal:translate-y-0 sm:text-7xl lg:text-8xl',
										stat.pending
											? 'text-muted-foreground/40'
											: 'text-foreground'
									)}
								>
									{/* {stat.value} */}
									<NumberTicker
										value={Number(stat.value)}
										// className="text-8xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
									/>
									{stat.suffix ? (
										<span className="ml-0.5 font-serif text-3xl text-muted-foreground italic sm:text-4xl">
											{stat.suffix}
										</span>
									) : null}
								</span>
							</dt>

							<dd
								className={cn(
									'mt-4 font-mono text-[0.6rem] tracking-[0.2em] uppercase transition-opacity delay-300 duration-700 group-data-[revealed=true]/reveal:opacity-100 sm:text-[0.65rem]',
									'text-muted-foreground opacity-0'
								)}
							>
								{stat.label}
							</dd>
						</Reveal>
					))}
				</dl>
			</div>
		</section>
	);
}
