import { HeroDepth } from '@/enums/home';
import { Particles } from '@workspace/ui/components/particles';

/**
 * The heroes' shared backdrop: an aurora in two soft glows, a lens-style
 * vignette, film grain, and a drifting particle field. Positioned to fill the
 * nearest positioned ancestor; render it first so everything sits over it.
 */
export function HeroAtmosphere() {
	return (
		<>
			{/* Its own opaque base, first and non-negotiable. The grain below
			    blends `soft-light` against whatever is directly behind it, and
			    any transform on an ancestor (a GSAP pin, ScrollSmoother, a
			    scroll-linked move) isolates the blend from the page. Over
			    nothing, the grain renders as raw grey noise and lifts the
			    whole hero off the page colour — the grainy hero with a dark
			    band above it. With this base the blend always has the page
			    colour to work against, whatever wraps the hero. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-background"
			/>

			{/* Atmosphere, in three soft layers. All of it is blurred and
		    low-frequency on purpose: the constellation is crisp lines and
		    points, so anything sharp back here would compete with it
		    rather than give it somewhere to sit. The glows share one depth
		    plane for the cinematic hero's parallax: the outer layer takes
		    the scroll, the inner the pointer, and the glows keep their own
		    translate and drift. */}
			<span
				aria-hidden
				data-hero-depth={HeroDepth.FAR}
				className="pointer-events-none absolute inset-0"
			>
				<span
					data-hero-pointer={HeroDepth.FAR}
					className="absolute inset-0"
				>
					<span
						aria-hidden
						className="pointer-events-none absolute top-1/2 right-0 h-[46rem] w-[46rem] translate-x-1/4 -translate-y-1/2 rounded-full blur-3xl motion-safe:animate-aurora"
						style={{
							background:
								'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 68%)'
						}}
					/>
					<span
						aria-hidden
						className="pointer-events-none absolute -bottom-40 left-0 h-[34rem] w-[34rem] rounded-full blur-3xl motion-safe:animate-aurora"
						style={{
							animationDelay: '-13s',
							background:
								'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 70%)'
						}}
					/>
				</span>
			</span>

			{/* Framing: the edges fall away the way a lens would. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 78% 78% at 50% 45%, transparent 40%, color-mix(in oklab, var(--color-background) 85%, transparent) 100%)'
				}}
			/>

			{/* Film grain — the one texture that reads as cinematic without
		    putting a second geometry into the frame. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-soft-light"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
					backgroundSize: '160px 160px'
				}}
			/>

			<span
				aria-hidden
				data-hero-depth={HeroDepth.MID}
				className="pointer-events-none absolute inset-0"
			>
				<span
					data-hero-pointer={HeroDepth.MID}
					className="absolute inset-0"
				>
					<Particles
						className="pointer-events-none absolute inset-0 z-0"
						quantity={100}
						ease={80}
						color="#ffffff"
						refresh
					/>
				</span>
			</span>
		</>
	);
}
