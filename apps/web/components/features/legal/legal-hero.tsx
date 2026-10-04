import Link from 'next/link';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { Reveal } from '@/components/snippets/reveal/reveal';
import type { NavItem } from '@/types/nav';
import { formatLongDate } from '@/utils/date';

interface LegalHeroProps {
	title: string;
	lead: string;
	updatedAt: string;
	/** The other legal document, linked from the meta line. */
	companion: NavItem;
}

/** Centred on the reading column, like the article hero — these are read. */
export function LegalHero({
	title,
	lead,
	updatedAt,
	companion
}: LegalHeroProps) {
	return (
		<section className="relative isolate -mt-16 overflow-hidden px-4 sm:px-6 lg:px-8">
			<Atmosphere intensity="quiet" />

			<div className="relative mx-auto max-w-2xl pt-36 pb-12 sm:pt-40 lg:pt-44">
				<Reveal trigger="mount">
					<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
						Legal
					</p>

					<h1 className="mt-4 font-heading text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-semibold tracking-tight text-balance text-foreground">
						{title}
					</h1>

					<p className="mt-6 text-lg text-pretty text-muted-foreground">
						{lead}
					</p>

					<p className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
						<span>
							Last updated{' '}
							<time
								dateTime={updatedAt}
								className="text-foreground"
							>
								{formatLongDate(updatedAt)}
							</time>
						</span>
						<Link
							href={companion.href}
							className="underline decoration-primary/50 underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
						>
							Read our {companion.label.toLowerCase()}
						</Link>
					</p>
				</Reveal>
			</div>
		</section>
	);
}
