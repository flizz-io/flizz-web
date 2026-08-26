import { Reveal } from '@/components/snippets/reveal/reveal';
import { valueProps } from '@/constants/home';

export function WhyUs() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
			<Reveal className="max-w-xl">
				<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
					Why Flizz
				</p>
				<h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
					We Create Solutions That
				</h2>
			</Reveal>

			<div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
				{valueProps.map((value, index) => (
					<Reveal
						key={value.title}
						delay={index * 60}
						className="border-t border-border pt-5"
					>
						<h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
							{value.title}
						</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							{value.description}
						</p>
					</Reveal>
				))}
			</div>
		</section>
	);
}
