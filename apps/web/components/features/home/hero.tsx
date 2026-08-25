import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { siteConfig } from '@/configs/site';
import { Button } from '@workspace/ui/components/button';

export function Hero() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
			<Reveal className="max-w-2xl">
				<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
					{siteConfig.shortName}
				</p>
				<h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
					{siteConfig.tagline}
				</h1>
				<p className="mt-4 text-base text-muted-foreground">
					{siteConfig.description}
				</p>
				<div className="mt-8 flex gap-3">
					<Button asChild>
						<Link href="/contact">Get Started</Link>
					</Button>
					<Button
						asChild
						variant="outline"
					>
						<Link href="/product">Learn More</Link>
					</Button>
				</div>
			</Reveal>
		</section>
	);
}
