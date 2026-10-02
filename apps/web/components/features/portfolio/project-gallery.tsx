'use client';

import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import type { ProjectGalleryImage } from '@/types/portfolio';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle
} from '@workspace/ui/components/dialog';
import { cn } from '@workspace/ui/lib/utils';

interface ProjectGalleryProps {
	images: ProjectGalleryImage[];
	projectName: string;
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/** Used when the API didn't record a size — the gallery preset's frame. */
const FALLBACK_SIZE = { width: 1600, height: 1200 };

const corners = [
	'top-0 left-0 border-t border-l',
	'top-0 right-0 border-t border-r',
	'bottom-0 left-0 border-b border-l',
	'right-0 bottom-0 border-b border-r'
];

const pad = (value: number) => String(value).padStart(2, '0');

function sizeOf(image: ProjectGalleryImage) {
	return {
		width: image.width ?? FALLBACK_SIZE.width,
		height: image.height ?? FALLBACK_SIZE.height
	};
}

interface PlateProps {
	image: ProjectGalleryImage;
	index: number;
	total: number;
	projectName: string;
	sizes: string;
	onOpen: () => void;
}

/** One screen on the sheet, at its own proportions — nothing is cropped. */
function Plate({
	image,
	index,
	total,
	projectName,
	sizes,
	onOpen
}: PlateProps) {
	const alt = image.caption ?? `${projectName}, screen ${index + 1}`;

	return (
		<figure className="break-inside-avoid">
			<button
				type="button"
				onClick={onOpen}
				className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/60 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
				aria-label={`View larger: ${alt}`}
			>
				<Image
					src={image.url}
					alt={alt}
					{...sizeOf(image)}
					sizes={sizes}
					className="h-auto w-full"
				/>
			</button>
			<figcaption className="mt-3 flex items-baseline gap-4 text-sm">
				<span className="shrink-0 font-mono text-xs tracking-[0.18em] text-muted-foreground tabular-nums">
					{pad(index + 1)} / {pad(total)}
				</span>
				{image.caption ? (
					<span className="text-pretty text-muted-foreground">
						{image.caption}
					</span>
				) : null}
			</figcaption>
		</figure>
	);
}

/**
 * The screens themselves, laid out like a contact sheet: the first one the
 * editor chose runs the full width as the lead plate, the rest fall into
 * columns at their own proportions, so a tall phone screen and a wide
 * dashboard sit together without either being cropped to fit.
 *
 * A plate opens full-screen inside the registration marks the site uses for
 * reserved artwork — the frame that held the space is the one that shows the
 * work. Arrow keys step through; the dialog is portalled, so ScrollSmoother's
 * transform never touches it.
 */
export function ProjectGallery({
	images,
	projectName,
	sectionIndex,
	totalSections,
	className
}: ProjectGalleryProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const total = images.length;

	const step = useCallback(
		(offset: number) =>
			setOpenIndex((current) =>
				current === null ? current : (current + offset + total) % total
			),
		[total]
	);

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'ArrowRight') step(1);
		if (event.key === 'ArrowLeft') step(-1);
	};

	if (!total) return null;

	const [lead, ...rest] = images;
	const open = openIndex === null ? null : images[openIndex];

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				{/* TODO: PM to confirm this headline. */}
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="The screens"
					title="What we put in front of people"
				/>

				{lead ? (
					<Reveal className="mt-12">
						<Plate
							image={lead}
							index={0}
							total={total}
							projectName={projectName}
							sizes="(min-width: 1280px) 80rem, 100vw"
							onOpen={() => setOpenIndex(0)}
						/>
					</Reveal>
				) : null}

				{rest.length ? (
					<Reveal
						delay={80}
						className={cn(
							'mt-10 gap-6 sm:columns-2 [&>figure]:mb-10',
							rest.length > 2 && 'lg:columns-3'
						)}
					>
						{rest.map((image, offset) => (
							<Plate
								key={image.url}
								image={image}
								index={offset + 1}
								total={total}
								projectName={projectName}
								sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
								onOpen={() => setOpenIndex(offset + 1)}
							/>
						))}
					</Reveal>
				) : null}
			</div>

			<Dialog
				open={open !== null}
				onOpenChange={(next) => !next && setOpenIndex(null)}
			>
				<DialogContent
					showCloseButton={false}
					onKeyDown={handleKeyDown}
					className="top-0 left-0 flex h-svh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-background/95 p-4 ring-0 sm:max-w-none sm:p-8"
				>
					{open && openIndex !== null ? (
						<>
							<div className="flex items-center justify-between gap-4">
								<DialogTitle className="font-mono text-xs tracking-[0.18em] text-muted-foreground tabular-nums">
									<span className="sr-only">
										{projectName}, screen{' '}
									</span>
									{pad(openIndex + 1)} / {pad(total)}
								</DialogTitle>
								<DialogClose asChild>
									<Button
										variant="ghost"
										size="icon"
										aria-label="Close"
									>
										<X />
									</Button>
								</DialogClose>
							</div>

							<div className="relative mx-auto my-4 flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center p-4 sm:p-6">
								{corners.map((corner) => (
									<span
										key={corner}
										aria-hidden
										className={cn(
											'pointer-events-none absolute size-6 border-primary/60',
											corner
										)}
									/>
								))}
								<Image
									key={open.url}
									src={open.url}
									alt={
										open.caption ??
										`${projectName}, screen ${openIndex + 1}`
									}
									{...sizeOf(open)}
									sizes="100vw"
									className="h-auto max-h-full w-auto max-w-full object-contain motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in-0 motion-safe:zoom-in-[0.98]"
								/>
							</div>

							<div className="flex items-center justify-between gap-4">
								<Button
									variant="outline"
									size="icon-lg"
									onClick={() => step(-1)}
									disabled={total < 2}
									aria-label="Previous screen"
								>
									<ArrowLeft />
								</Button>
								<DialogDescription className="max-w-2xl text-center text-pretty text-muted-foreground">
									{open.caption ?? ''}
								</DialogDescription>
								<Button
									variant="outline"
									size="icon-lg"
									onClick={() => step(1)}
									disabled={total < 2}
									aria-label="Next screen"
								>
									<ArrowRight />
								</Button>
							</div>
						</>
					) : null}
				</DialogContent>
			</Dialog>
		</section>
	);
}
