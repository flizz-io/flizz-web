import { Blocks, Clock, Users, type LucideIcon } from 'lucide-react';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { problemItems } from '@/constants/home';
import type { ProblemItem } from '@/types/home';

const icons: Record<ProblemItem['icon'], LucideIcon> = {
	blocks: Blocks,
	users: Users,
	clock: Clock
};

export function Problem() {
	return (
		<section className="dark border-y border-border bg-background text-foreground">
			<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<Reveal className="mx-auto max-w-2xl text-center">
					<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
						The Problem
					</p>
					<h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
						Is This How You&apos;re Building Your Digital Solutions?
					</h2>
					<p className="mt-4 text-base text-muted-foreground">
						Most businesses face the same frustrating choices when
						building software.
					</p>
				</Reveal>

				<div className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
					{problemItems.map((item, index) => {
						const Icon = icons[item.icon];
						return (
							<Reveal
								key={item.title}
								delay={index * 80}
								className="bg-background p-8"
							>
								<Icon className="size-6 text-primary" />
								<h3 className="mt-5 font-heading text-lg font-semibold tracking-tight">
									{item.title}
								</h3>
								<p className="mt-3 text-sm text-muted-foreground">
									{item.description}
								</p>
							</Reveal>
						);
					})}
				</div>

				<Reveal className="mx-auto mt-14 max-w-2xl border-t border-border pt-10 text-center">
					<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
						The Real Cost
					</p>
					<p className="mt-4 text-base text-pretty text-muted-foreground">
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
