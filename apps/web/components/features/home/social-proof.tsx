import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { socialProofLogos } from '@/constants/home';

export function SocialProof() {
	const logos = [...socialProofLogos, ...socialProofLogos];

	return (
		<section className="border-b border-border py-10">
			<Reveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<SectionTag
					index={2}
					label="Trusted by businesses building what's next"
				/>
			</Reveal>

			<div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
				<div className="flex w-max animate-marquee items-center gap-16">
					{logos.map((logo, index) => (
						<span
							key={`${logo}-${index}`}
							className="font-heading text-2xl font-semibold whitespace-nowrap text-muted-foreground/70"
						>
							{logo}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
