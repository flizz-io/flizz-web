import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { valueProps } from '@/constants/home';

export function WhyUs() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
			<Reveal className="max-w-xl">
				<SectionTag
					index={7}
					label="Why Flizz"
				/>
				<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
					We create solutions that
				</h2>
			</Reveal>

			<div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
				{valueProps.map((value, index) => (
					<Reveal
						key={value.title}
						delay={index * 50}
						className="border-t border-border pt-6"
					>
						<span className="font-mono text-sm text-primary">
							{String(index + 1).padStart(2, '0')}
						</span>
						<h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-foreground">
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
