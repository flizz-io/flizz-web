import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { socialLinks } from '@/configs/footer';
import { contactChannels } from '@/constants/contact';
import { cn } from '@workspace/ui/lib/utils';

interface ContactChannelsProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * For people who would rather not use a form at all. Deliberately a strip
 * rather than a full section — it is an alternative to the ask above, not
 * another one.
 */
export function ContactChannels({
	sectionIndex,
	totalSections,
	className
}: ContactChannelsProps) {
	return (
		<section
			className={cn(
				'border-t border-border px-4 py-16 sm:px-6 lg:px-8',
				className
			)}
		>
			<Reveal className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Other ways in"
					/>

					{contactChannels.map((channel) => (
						<div
							key={channel.href}
							className="mt-5"
						>
							<Link
								href={channel.href}
								className="group inline-flex items-baseline gap-3"
							>
								<span className="font-heading text-3xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-4xl">
									{channel.value}
								</span>
								<ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
							</Link>
							<p className="mt-3 max-w-sm text-sm text-muted-foreground">
								{channel.description}
							</p>
						</div>
					))}
				</div>

				<ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
					{socialLinks.map((social) => (
						<li key={social.href}>
							<Link
								href={social.href}
								className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-primary hover:underline"
							>
								{social.label}
							</Link>
						</li>
					))}
				</ul>
			</Reveal>
		</section>
	);
}
