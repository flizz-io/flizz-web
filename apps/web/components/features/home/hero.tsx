import { Check } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { heroUsps } from '@/constants/home';
import { Button } from '@workspace/ui/components/button';

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
				style={{
					backgroundImage:
						'radial-gradient(var(--color-border) 1px, transparent 1px)',
					backgroundSize: '28px 28px'
				}}
			/>

			<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<SchematicFrame className="mx-auto max-w-3xl border border-border bg-card/60 px-6 py-12 text-center backdrop-blur-sm sm:px-12 sm:py-16">
					<Reveal>
						<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
							Software Engineering Partner
						</p>
						<h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
							Your Technology Partner for What&apos;s Next
						</h1>
						<p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
							We build transparent, maintainable systems that give
							you freedom to pivot, scale, or switch vendors
							without starting over.
						</p>
						<p className="mx-auto mt-4 max-w-xl text-sm text-pretty text-muted-foreground">
							Technology decisions have long-term consequences. We
							bring both technical expertise and business
							perspective to every project, building solutions
							that align with where you&apos;re going, not just
							where you are.
						</p>
					</Reveal>

					<Reveal
						delay={100}
						className="mt-8 flex flex-col items-center gap-3 sm:items-start"
					>
						<ul className="mx-auto flex max-w-md flex-col gap-2.5 text-left">
							{heroUsps.map((usp) => (
								<li
									key={usp.text}
									className="flex items-start gap-2.5 text-sm text-foreground"
								>
									<Check className="mt-0.5 size-4 shrink-0 text-primary" />
									<span>{usp.text}</span>
								</li>
							))}
						</ul>
					</Reveal>

					<Reveal
						delay={200}
						className="mt-9"
					>
						<Button
							asChild
							size="lg"
						>
							<Link href="/contact">
								Schedule a Discovery Call →
							</Link>
						</Button>
					</Reveal>
				</SchematicFrame>
			</div>
		</section>
	);
}
