'use client';

import { Fragment, useEffect, useState } from 'react';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { testimonials } from '@/constants/home';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi
} from '@workspace/ui/components/carousel';
import { cn } from '@workspace/ui/lib/utils';

/** How long after a quote lands before its emphasis warms to the accent. */
const HIGHLIGHT_DELAY_MS = 450;

function getInitials(name: string) {
	return name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

/**
 * Splits a quote around its highlight phrases. Longest first, so a phrase that
 * contains another can't be broken apart by the shorter one matching inside it.
 */
function splitOnHighlights(quote: string, highlights: string[]) {
	if (!highlights.length) return [{ text: quote, lit: false }];

	const pattern = new RegExp(
		`(${[...highlights]
			.sort((a, b) => b.length - a.length)
			.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
			.join('|')})`,
		'gi'
	);

	return quote
		.split(pattern)
		.filter(Boolean)
		.map((text) => ({
			text,
			lit: highlights.some(
				(phrase) => phrase.toLowerCase() === text.toLowerCase()
			)
		}));
}

interface TestimonialsProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

export function Testimonials({
	sectionIndex,
	totalSections,
	className
}: TestimonialsProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	// Tracked as an index rather than a boolean so the reset is a derived
	// comparison instead of a setState in the effect body.
	const [litIndex, setLitIndex] = useState<number | null>(null);

	useEffect(() => {
		if (!api) return;

		const onSelect = () => setCurrent(api.selectedScrollSnap());

		onSelect();
		api.on('select', onSelect);

		return () => {
			api.off('select', onSelect);
		};
	}, [api]);

	useEffect(() => {
		const timer = window.setTimeout(
			() => setLitIndex(current),
			HIGHLIGHT_DELAY_MS
		);

		return () => window.clearTimeout(timer);
	}, [current]);

	return (
		<section
			className={cn(
				'relative overflow-hidden border-t border-border bg-secondary/30',
				className
			)}
		>
			{/* A pool of accent behind the quote, so the calm section still has
			    some depth to it. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 h-72"
				style={{
					background:
						'radial-gradient(ellipse 55% 100% at 50% 0%, color-mix(in oklab, var(--color-primary) 10%, transparent), transparent 70%)'
				}}
			/>

			{/* Lives out here rather than in the slide: embla's track clips
			    its own overflow, which swallowed the glyph entirely. */}
			<span
				aria-hidden
				className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 font-serif text-[16rem] leading-none text-primary/[0.08] select-none sm:top-24"
			>
				&ldquo;
			</span>

			<div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<Reveal delay={80}>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="What Clients Say"
						className="mb-14 text-center"
					/>

					<Carousel
						setApi={setApi}
						opts={{ align: 'start', loop: true }}
					>
						<CarouselContent>
							{testimonials.map((testimonial, index) => {
								const isLit = litIndex === index;

								return (
									<CarouselItem key={testimonial.author}>
										<figure className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 py-4 text-center">
											<blockquote className="relative font-serif text-3xl leading-tight text-pretty text-foreground italic sm:text-4xl">
												{splitOnHighlights(
													testimonial.quote,
													testimonial.highlights ?? []
												).map((part, partIndex) => (
													<Fragment key={partIndex}>
														{part.lit ? (
															<span
																className={cn(
																	'transition-colors duration-700 ease-power-on',
																	isLit
																		? 'text-primary'
																		: 'text-foreground'
																)}
															>
																{part.text}
															</span>
														) : (
															part.text
														)}
													</Fragment>
												))}
											</blockquote>

											<figcaption className="flex items-center gap-3">
												<Avatar
													className={cn(
														'ring-2 ring-offset-2 ring-offset-background transition-colors duration-700',
														isLit
															? 'ring-primary/60'
															: 'ring-transparent'
													)}
												>
													<AvatarFallback>
														{getInitials(
															testimonial.author
														)}
													</AvatarFallback>
												</Avatar>
												<div className="text-left">
													<p className="text-sm font-medium text-foreground">
														{testimonial.author}
													</p>
													<p className="text-xs text-muted-foreground">
														{testimonial.role}
													</p>
												</div>
											</figcaption>
										</figure>
									</CarouselItem>
								);
							})}
						</CarouselContent>

						<div className="mt-10 flex items-center justify-center gap-5">
							<CarouselPrevious
								variant="outline"
								className="static translate-y-0"
							/>

							<div className="flex items-center gap-2">
								{testimonials.map((testimonial, index) => (
									<button
										key={testimonial.author}
										type="button"
										onClick={() => api?.scrollTo(index)}
										aria-label={`Show testimonial ${index + 1}`}
										aria-current={index === current}
										className={cn(
											'h-1 rounded-full transition-all duration-500',
											index === current
												? 'w-7 bg-primary'
												: 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
										)}
									/>
								))}
							</div>

							<CarouselNext
								variant="outline"
								className="static translate-y-0"
							/>
						</div>
					</Carousel>
				</Reveal>
			</div>
		</section>
	);
}
