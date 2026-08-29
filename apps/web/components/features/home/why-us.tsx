'use client';

import { useEffect, useRef, useState } from 'react';

import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { valueProps } from '@/constants/home';
import { Text3DFlip } from '@workspace/ui/components/text-3d-flip';
import { cn } from '@workspace/ui/lib/utils';

/**
 * The headline is a sentence stem — "We create solutions that" — and each value
 * prop finishes it. So the stem stays put while the endings scroll through it,
 * and whichever ending is at the reading line is the one lit: at any scroll
 * position the section reads as one complete sentence.
 */
interface WhyUsProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
	/** Show every description at once instead of only the active clause's. */
	showAllDescriptions?: boolean;
}

export function WhyUs({
	sectionIndex,
	totalSections,
	className,
	showAllDescriptions = true
}: WhyUsProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const listRef = useRef<HTMLOListElement>(null);

	useEffect(() => {
		const list = listRef.current;
		if (!list) return;

		// A narrow band across the middle of the viewport: a clause counts as
		// active only while it crosses the reading line, so exactly one is lit
		// and it changes as you read rather than as things enter the screen.
		const observer = new IntersectionObserver(
			(entries) => {
				const arrived = entries.find((entry) => entry.isIntersecting);
				if (!arrived) return;

				setActiveIndex(
					Number((arrived.target as HTMLElement).dataset.index ?? '0')
				);
			},
			{ rootMargin: '-48% 0px -48% 0px' }
		);

		list.querySelectorAll('[data-index]').forEach((clause) =>
			observer.observe(clause)
		);

		return () => observer.disconnect();
	}, []);

	return (
		<section
			className={cn(
				'border-b border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
				{/* Centred in the viewport rather than pinned to its top, so
				    the column tracks the clause being read instead of leaving a
				    void beside the list. Deliberately shorter than the viewport:
				    a full-height sticky in a container only a little taller than
				    the screen has almost no travel and unsticks immediately. */}
				<div className="lg:sticky lg:top-[calc((100svh-500px)/2)] lg:flex lg:h-125 lg:flex-col lg:justify-center lg:self-start">
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Why Flizzio"
					/>
					<h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
						We create solutions that
					</h2>

					{/* The stem's other half. Set in the serif and in the
					    accent so it reads as the sentence finishing rather
					    than as a second copy of the list item beside it.
					    Fixed height: the longest clause runs to two lines and
					    swapping between them must not move the column. */}
					<div
						aria-hidden
						className="mt-4 hidden h-24 lg:block"
					>
						{valueProps.map((value, index) => (
							<p
								key={value.title}
								className={cn(
									'font-serif text-3xl leading-tight text-primary italic transition-opacity duration-500',
									index === activeIndex
										? 'opacity-100'
										: 'hidden opacity-0'
								)}
							>
								{value.title.charAt(0).toLowerCase() +
									value.title.slice(1)}
								.
							</p>
						))}
					</div>

					<span
						aria-hidden
						className="mt-6 hidden h-px w-24 bg-primary/60 lg:block"
					/>

					{/* The active clause's detail lives here, so the column
					    carries the reading position instead of sitting empty.
					    Fixed height, so swapping copy can't move anything. */}
					{!showAllDescriptions ? (
						<div className="mt-6 hidden h-28 lg:block">
							{valueProps.map((value, index) => (
								<p
									key={value.title}
									className={cn(
										'max-w-sm text-base text-muted-foreground transition-opacity duration-500',
										index === activeIndex
											? 'opacity-100'
											: 'hidden opacity-0'
									)}
								>
									{value.description}
								</p>
							))}
						</div>
					) : null}

					<p className="mt-8 hidden font-mono text-xs tracking-[0.25em] text-muted-foreground lg:block">
						<span className="text-primary">
							{String(activeIndex + 1).padStart(2, '0')}
						</span>{' '}
						/ {String(valueProps.length).padStart(2, '0')}
					</p>
				</div>

				<ol
					ref={listRef}
					className="flex flex-col gap-10 sm:gap-12"
				>
					{valueProps.map((value, index) => {
						const isActive = index === activeIndex;

						return (
							<li
								key={value.title}
								data-index={index}
								className="flex gap-5 sm:gap-7"
							>
								<span
									className={cn(
										'mt-2 shrink-0 font-mono text-sm transition-colors duration-500',
										isActive
											? 'text-primary'
											: 'text-muted-foreground/40'
									)}
								>
									{String(index + 1).padStart(2, '0')}
								</span>

								<div className="min-w-0 flex-1">
									<Text3DFlip
										as="h3"
										active={isActive}
										flipOnHover={false}
										rotateDirection="top"
										staggerDuration={0.012}
										className={cn(
											'font-heading text-2xl font-semibold tracking-tight transition-colors duration-500 sm:text-3xl lg:text-4xl',
											isActive
												? 'text-foreground'
												: 'text-foreground/25'
										)}
									>
										{value.title}
									</Text3DFlip>

									{/* Inline only when every description is
									    wanted, or on small screens where there
									    is no sticky column to put them in. */}
									<p
										className={cn(
											'mt-3 max-w-md text-sm text-muted-foreground transition-opacity duration-500 sm:text-base',
											showAllDescriptions
												? 'opacity-100'
												: 'lg:hidden',
											!showAllDescriptions &&
												!isActive &&
												'opacity-60'
										)}
									>
										{value.description}
									</p>
								</div>
							</li>
						);
					})}
				</ol>
			</div>
		</section>
	);
}
