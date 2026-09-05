import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { ServiceBackNav, serviceCategoryAnchors } from '@/enums/services';
import type { ServiceDetail } from '@/types/services';
import { ServiceVisual } from '@workspace/service-visuals';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceDetailHeroProps {
	service: ServiceDetail;
	/**
	 * Which way back to the catalogue the hero offers. Both routes are built —
	 * this picks which renders, so the two can be compared in place.
	 */
	backNav?: ServiceBackNav;
	className?: string;
}

/**
 * The specimen sits beside the headline in its own frame, not in a full-width
 * band below it. Two reasons, both learned the hard way: run edge to edge and
 * the hero splits into a text block and an unrelated strip with a rule between
 * them, and these scenes are small by design — blown up to full width the
 * geometry stops reading as a specimen and starts reading as a wireframe box
 * adrift in empty space.
 *
 * The frame matches the one the list page's viewer uses, so following a link
 * lands somewhere that looks like where it came from.
 */
export function ServiceDetailHero({
	service,
	backNav = ServiceBackNav.BOTH,
	className
}: ServiceDetailHeroProps) {
	const showBackLink =
		backNav === ServiceBackNav.LINK || backNav === ServiceBackNav.BOTH;
	const showCategoryLink =
		backNav === ServiceBackNav.CATEGORY || backNav === ServiceBackNav.BOTH;
	const categoryHref = `/services#${serviceCategoryAnchors[service.category]}`;

	return (
		<section
			className={cn(
				// Pulled under the sticky header so the film starts at the top
				// of the page rather than 4rem down.
				'relative isolate -mt-16 overflow-hidden px-4 sm:px-6 lg:px-8',
				className
			)}
		>
			<Atmosphere />

			<div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 pt-40 pb-20 sm:pt-44 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:pt-48 lg:pb-28">
				<Reveal trigger="mount">
					{showBackLink ? (
						<Link
							href="/services"
							className="group/back mb-6 inline-flex items-center gap-2 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-foreground hover:underline"
						>
							<ArrowLeft className="size-3.5 transition-transform group-hover/back:-translate-x-0.5" />
							All services
						</Link>
					) : null}

					{showCategoryLink ? (
						<Link
							href={categoryHref}
							className="block font-mono text-xs tracking-[0.2em] text-primary uppercase underline-offset-4 hover:underline"
						>
							{service.category}
						</Link>
					) : (
						<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
							{service.category}
						</p>
					)}

					<h1 className="mt-5 font-heading text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.05] font-semibold tracking-tight text-balance text-foreground">
						{service.title}
					</h1>

					<p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
						{service.intro}
					</p>

					<div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
						<Button
							asChild
							size="lg"
							className="h-11 px-6"
						>
							<Link href="/contact">Talk about this →</Link>
						</Button>

						{service.engagement ? (
							<p className="font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
								Typical engagement
								<span className="ml-3 text-foreground">
									{service.engagement}
								</span>
							</p>
						) : null}
					</div>
				</Reveal>

				<Reveal
					trigger="mount"
					delay={140}
					className="w-full lg:justify-self-end"
				>
					<SchematicFrame className="border border-border bg-card/40 backdrop-blur-sm">
						<div className="flex items-center justify-between border-b border-border px-5 py-3">
							<span className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
								Specimen
							</span>
							<span className="flex items-center gap-2 font-mono text-sm tracking-[0.2em] text-primary uppercase">
								<span className="size-1.5 rounded-full bg-primary" />
								Live
							</span>
						</div>

						<ServiceVisual
							kind={service.visualKind}
							focused
							className="h-72 w-full sm:h-80"
						/>
					</SchematicFrame>
				</Reveal>
			</div>
		</section>
	);
}
