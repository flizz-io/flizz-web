import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import type { Service } from '@/types/services';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceRelatedProps {
	services: Service[];
	category: string;
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The rest of the same category. Deliberately the same row idiom as the list
 * page's index — this is the same feature, and a second row style would make
 * the two pages feel unrelated for no gain.
 */
export function ServiceRelated({
	services,
	category,
	sectionIndex,
	totalSections,
	className
}: ServiceRelatedProps) {
	if (!services.length) return null;

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<SectionTag
							index={sectionIndex}
							total={totalSections}
							label="Nearby"
						/>
						<h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
							Also in {category}
						</h2>
					</div>

					<Link
						href="/services"
						className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-sm text-foreground underline-offset-4 hover:text-primary hover:underline"
					>
						All services
						<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
				</Reveal>

				<ul className="mt-10">
					{services.map((service, index) => (
						<Reveal
							key={service.slug}
							delay={index * 70}
						>
							<li>
								<Link
									href={`/services/${service.slug}`}
									className="group/row flex items-start gap-5 border-b border-border py-5 first:border-t"
								>
									<span className="flex-1">
										<span className="block font-heading text-lg font-semibold tracking-tight text-balance text-foreground transition-colors group-hover/row:text-primary sm:text-xl">
											{service.title}
										</span>
										<span className="mt-1.5 block max-w-md text-sm text-pretty text-muted-foreground">
											{service.summary}
										</span>
									</span>

									<ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-primary" />
								</Link>
							</li>
						</Reveal>
					))}
				</ul>
			</div>
		</section>
	);
}
