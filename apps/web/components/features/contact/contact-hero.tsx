import { Radio } from 'lucide-react';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { contactCommitments } from '@/constants/contact';
import { cn } from '@workspace/ui/lib/utils';

/**
 * The hero states the terms before it asks for anything. Instead of decorative
 * artwork beside the headline, the frame carries the four commitments as an
 * instrument readout — the most useful thing we can put there, and the one
 * thing a visitor is actually weighing before they write.
 */
export function ContactHero({ className }: { className?: string }) {
	return (
		<section
			className={cn(
				// Pulled up under the header, which is `sticky` and so takes
				// its own 4rem of flow above `main`. Left in place, that strip
				// gets none of the atmosphere below and reads as a dark band
				// across the top of the page. The padding puts it back.
				'relative isolate -mt-16 overflow-hidden px-4 sm:px-6 lg:px-8',
				className
			)}
		>
			<Atmosphere />

			<div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 pt-40 pb-20 sm:pt-44 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:pt-48 lg:pb-28">
				<Reveal trigger="mount">
					<span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase backdrop-blur-sm dark:text-white/75">
						<Radio className="size-3.5 text-primary" />
						Contact
					</span>

					<h1 className="mt-7 font-heading text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.03] font-semibold tracking-tight text-balance text-foreground">
						Tell us what you&apos;re building, or what&apos;s{' '}
						<span className="font-serif text-primary italic">
							breaking
						</span>
						.
					</h1>

					<p className="mt-7 max-w-lg text-lg text-pretty text-muted-foreground">
						No sales script and no discovery deck. Describe the
						problem in your own words and an engineer writes back
						with what we&apos;d actually do about it.
					</p>
				</Reveal>

				<Reveal
					trigger="mount"
					delay={140}
					className="w-full lg:max-w-sm lg:justify-self-end"
				>
					<SchematicFrame className="border border-border bg-card/60 backdrop-blur-sm">
						<div className="flex items-center justify-between border-b border-border px-5 py-3">
							<span className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
								What you get
							</span>
							<span className="flex items-center gap-2 font-mono text-sm tracking-[0.2em] text-primary uppercase">
								<span className="relative flex size-1.5">
									<span className="absolute inline-flex size-full rounded-full bg-primary opacity-75 motion-safe:animate-ping" />
									<span className="relative inline-flex size-1.5 rounded-full bg-primary" />
								</span>
								Open
							</span>
						</div>

						<dl className="divide-y divide-border">
							{contactCommitments.map((commitment) => (
								<div
									key={commitment.term}
									className="flex items-baseline justify-between gap-4 px-5 py-3.5"
								>
									<dt className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
										{commitment.term}
									</dt>
									<dd className="text-right text-sm text-foreground">
										{commitment.value}
									</dd>
								</div>
							))}
						</dl>
					</SchematicFrame>
				</Reveal>
			</div>
		</section>
	);
}
