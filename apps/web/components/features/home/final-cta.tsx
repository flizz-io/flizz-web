import { Check } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { riskReversals } from '@/constants/home';
import { Button } from '@workspace/ui/components/button';

export function FinalCta() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
			<SchematicFrame className="border border-border bg-secondary/30 px-6 py-14 text-center sm:px-16">
				<Reveal className="mx-auto max-w-2xl">
					<h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
						Ready to Build Technology That Actually Works for Your
						Business?
					</h2>
					<p className="mt-4 text-base text-pretty text-muted-foreground">
						Whether you&apos;re launching something new, scaling
						what&apos;s working, or fixing what&apos;s broken —
						let&apos;s talk about how we can help you get there.
					</p>
				</Reveal>

				<Reveal
					delay={80}
					className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-2.5 sm:flex-row sm:justify-center sm:gap-6"
				>
					{riskReversals.map((risk) => (
						<span
							key={risk.text}
							className="flex items-center gap-2 text-sm text-foreground"
						>
							<Check className="size-4 shrink-0 text-primary" />
							{risk.text}
						</span>
					))}
				</Reveal>

				<Reveal
					delay={160}
					className="mt-9"
				>
					<Button
						asChild
						size="lg"
					>
						<Link href="/contact">Schedule a Discovery Call →</Link>
					</Button>
				</Reveal>
			</SchematicFrame>
		</section>
	);
}
