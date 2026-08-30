import { DotField } from '@/components/snippets/dot-field/dot-field';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { contactFormAnchorId } from '@/constants/contact';
import { cn } from '@workspace/ui/lib/utils';

interface ContactFormShellProps {
	sectionIndex: number;
	totalSections?: number;
	eyebrow: string;
	title: React.ReactNode;
	description: string;
	children: React.ReactNode;
	/** Each variation needs a different column width to sit right. */
	containerClassName?: string;
	className?: string;
}

/**
 * The section chrome every form variation sits in — tag, heading, ground and
 * the anchor the rest of the page links back to. Only the form inside it
 * changes between variations, so the page around the form stays identical
 * whichever one is chosen.
 *
 * Deliberately not the hero's atmosphere: this sits directly under it, and a
 * second aurora would run the two together into one field with no edge. A
 * raised ground and a still grid read as a working surface set into the page.
 */
export function ContactFormShell({
	sectionIndex,
	totalSections,
	eyebrow,
	title,
	description,
	children,
	containerClassName,
	className
}: ContactFormShellProps) {
	return (
		<section
			id={contactFormAnchorId}
			className={cn(
				'relative isolate scroll-mt-24 overflow-hidden border-y border-border bg-muted/60 px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<DotField />

			<div
				className={cn('relative mx-auto max-w-3xl', containerClassName)}
			>
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label={eyebrow}
					/>
					<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
						{title}
					</h2>
					<p className="mt-4 max-w-xl text-base text-pretty text-muted-foreground">
						{description}
					</p>
				</Reveal>

				<Reveal
					delay={80}
					className="mt-12 sm:mt-14"
				>
					{children}
				</Reveal>
			</div>
		</section>
	);
}
