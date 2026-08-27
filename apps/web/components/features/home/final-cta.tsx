import { Check } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { riskReversals } from '@/constants/home';
import { Button } from '@workspace/ui/components/button';

export function FinalCta() {
	return (
		<section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
			<SchematicFrame className="mx-auto max-w-6xl border border-border px-6 py-16 text-center sm:px-16 sm:py-20">
				<Reveal className="mx-auto max-w-2xl">
					<div className="flex justify-center">
						<SectionTag
							index={12}
							label="Let's Talk"
						/>
					</div>
					<h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
						Ready to build technology that actually works for your
						business?
					</h2>
					<p className="mt-5 text-lg text-pretty text-muted-foreground">
						Whether you&apos;re launching something new, scaling
						what&apos;s working, or fixing what&apos;s broken —
						let&apos;s talk about how we can help you get there.
					</p>
				</Reveal>

				<Reveal
					delay={80}
					className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-2.5 sm:flex-row sm:justify-center sm:gap-6"
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
					className="mt-10"
				>
					<Button
						asChild
						size="lg"
						className="h-11 px-6 text-base"
					>
						<Link href="/contact">Schedule a Discovery Call →</Link>
					</Button>
				</Reveal>
			</SchematicFrame>
		</section>
	);
}
