import { Reveal } from '@/components/snippets/reveal/reveal';
import { socialProofLogos } from '@/constants/home';

export function SocialProof() {
	const logos = [...socialProofLogos, ...socialProofLogos];

	return (
		<section className="border-y border-border bg-secondary/30 py-10">
			<Reveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<p className="text-center font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
					Trusted by businesses building what&apos;s next
				</p>
			</Reveal>

			<div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
				<div className="flex w-max animate-marquee items-center gap-16">
					{logos.map((logo, index) => (
						<span
							key={`${logo}-${index}`}
							className="font-heading text-xl font-semibold whitespace-nowrap text-muted-foreground/60 grayscale"
						>
							{logo}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
