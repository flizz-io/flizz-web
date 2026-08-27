import { Reveal } from '@/components/snippets/reveal/reveal';
import { problemItems } from '@/constants/home';

export function Problem() {
	return (
		<section className="border-y border-border bg-primary text-primary-foreground">
			<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<Reveal className="max-w-2xl">
					<p className="font-mono text-xs tracking-[0.2em] text-primary-foreground/60 uppercase">
						04 / 12 — The Problem
					</p>
					<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
						Is this how you&apos;re building your digital solutions?
					</h2>
					<p className="mt-4 text-base text-primary-foreground/75">
						Most businesses face the same frustrating choices when
						building software.
					</p>
				</Reveal>

				<div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
					{problemItems.map((item, index) => (
						<Reveal
							key={item.title}
							delay={index * 80}
							className="border-t border-primary-foreground/20 pt-6"
						>
							<span className="font-mono text-sm text-primary-foreground/60">
								{String(index + 1).padStart(2, '0')}
							</span>
							<h3 className="mt-4 font-heading text-xl font-semibold tracking-tight">
								{item.title}
							</h3>
							<p className="mt-3 text-sm text-primary-foreground/75">
								{item.description}
							</p>
						</Reveal>
					))}
				</div>

				<Reveal className="mt-16 max-w-2xl border-t border-primary-foreground/20 pt-10">
					<p className="font-mono text-xs tracking-[0.2em] text-primary-foreground/60 uppercase">
						The Real Cost
					</p>
					<p className="mt-4 text-lg text-pretty">
						Technology that holds you back instead of moving you
						forward. Competitive advantages you can&apos;t capture.
						Growth opportunities you can&apos;t pursue. Teams
						frustrated by tools that make work harder, not easier.
					</p>
				</Reveal>
			</div>
		</section>
	);
}
