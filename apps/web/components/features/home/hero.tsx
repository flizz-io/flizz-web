import { Check } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { heroUsps } from '@/constants/home';
import { Button } from '@workspace/ui/components/button';

export function Hero() {
	return (
		<section className="relative overflow-hidden border-b border-border">
			<div
				aria-hidden
				className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent)]"
				style={{
					backgroundImage:
						'radial-gradient(var(--color-border) 1px, transparent 1px)',
					backgroundSize: '32px 32px'
				}}
			/>

			<SchematicFrame className="mx-4 my-4 flex min-h-[calc(100vh-4rem-2rem)] flex-col justify-center border border-border px-6 py-16 sm:mx-6 sm:px-10 lg:mx-8 lg:px-16">
				<div className="mx-auto w-full max-w-5xl">
					<Reveal>
						<SectionTag
							index={1}
							label="Software Engineering Partner"
						/>
						<h1 className="mt-6 font-heading text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] font-semibold tracking-tight text-balance text-foreground">
							Your technology partner
							<br />
							for what&apos;s{' '}
							<span className="text-primary italic">next</span>.
						</h1>
						<p className="mt-8 max-w-xl text-lg text-pretty text-muted-foreground">
							We build transparent, maintainable systems that give
							you freedom to pivot, scale, or switch vendors
							without starting over.
						</p>
					</Reveal>

					<Reveal
						delay={100}
						className="mt-12 flex flex-col gap-8 border-t border-border pt-8 sm:flex-row sm:items-end sm:justify-between"
					>
						<ul className="flex flex-col gap-3 sm:flex-row sm:gap-10">
							{heroUsps.map((usp) => (
								<li
									key={usp.text}
									className="flex max-w-64 items-start gap-2 text-sm text-foreground"
								>
									<Check className="mt-0.5 size-4 shrink-0 text-primary" />
									<span>{usp.text}</span>
								</li>
							))}
						</ul>

						<Button
							asChild
							size="lg"
							className="h-11 shrink-0 px-5 text-base"
						>
							<Link href="/contact">
								Schedule a Discovery Call →
							</Link>
						</Button>
					</Reveal>
				</div>
			</SchematicFrame>
		</section>
	);
}
