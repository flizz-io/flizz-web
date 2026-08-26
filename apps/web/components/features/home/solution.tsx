import { Reveal } from '@/components/snippets/reveal/reveal';
import { processSteps } from '@/constants/home';

export function Solution() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
			<Reveal className="mx-auto max-w-2xl text-center">
				<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
					Our Process
				</p>
				{/* TODO: PM to confirm final headline — the sheet duplicated the Problem section's headline here */}
				<h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
					How We Get You There
				</h2>
			</Reveal>

			<div className="relative mx-auto mt-16 max-w-2xl">
				<div className="absolute top-2 bottom-2 left-4 w-px bg-border" />

				<ol className="flex flex-col gap-12">
					{processSteps.map((step, index) => (
						<li
							key={step.title}
							className="relative"
						>
							<Reveal delay={index * 80}>
								<span className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border border-primary bg-background font-mono text-xs text-primary">
									{String(index + 1).padStart(2, '0')}
								</span>
								<div className="pl-14">
									<h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
										{step.title}
									</h3>
									<p className="mt-2.5 text-sm text-muted-foreground">
										{step.description}
									</p>
									<p className="mt-3 font-mono text-xs text-primary">
										What you get — {step.whatYouGet}
									</p>
								</div>
							</Reveal>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
