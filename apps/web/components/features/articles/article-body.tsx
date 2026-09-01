import { Fragment } from 'react';

import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import type { ArticleBlock } from '@/types/articles';
import { cn } from '@workspace/ui/lib/utils';

interface ArticleBodyProps {
	body: ArticleBlock[];
	className?: string;
}

/**
 * Renders the block array. The switch is exhaustive over the union, so adding
 * a block type to `ArticleBlock` fails the build here rather than silently
 * rendering nothing — which is the whole reason the body is typed JSON instead
 * of a string of HTML.
 *
 * The column stays narrow at every width. Long measure is the single thing
 * most likely to make a reading page fail.
 */
export function ArticleBody({ body, className }: ArticleBodyProps) {
	return (
		<div className={cn('mx-auto max-w-2xl', className)}>
			{body.map((block, index) => (
				<Fragment key={index}>{renderBlock(block)}</Fragment>
			))}
		</div>
	);
}

function renderBlock(block: ArticleBlock) {
	switch (block.type) {
		case 'paragraph':
			return (
				<p className="mt-6 text-lg leading-relaxed text-pretty text-muted-foreground first:mt-0">
					{block.text}
				</p>
			);

		case 'heading':
			return block.level === 2 ? (
				<h2 className="mt-14 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
					{block.text}
				</h2>
			) : (
				<h3 className="mt-10 font-heading text-xl font-semibold tracking-tight text-balance text-foreground">
					{block.text}
				</h3>
			);

		case 'list': {
			const items = block.items.map((item) => (
				<li
					key={item}
					className="pl-2 text-lg leading-relaxed text-pretty text-muted-foreground marker:text-primary"
				>
					{item}
				</li>
			));

			return block.ordered ? (
				<ol className="mt-6 list-decimal space-y-3 pl-6">{items}</ol>
			) : (
				<ul className="mt-6 list-disc space-y-3 pl-6">{items}</ul>
			);
		}

		case 'quote':
			return (
				<figure className="mt-10 border-l-2 border-primary/50 pl-6">
					<blockquote className="font-serif text-xl leading-snug text-pretty text-foreground italic sm:text-2xl">
						{block.text}
					</blockquote>
					{block.attribution ? (
						<figcaption className="mt-3 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
							{block.attribution}
						</figcaption>
					) : null}
				</figure>
			);

		case 'image':
			return (
				<figure className="mt-10">
					<div
						className="relative overflow-hidden rounded-lg border border-border"
						style={{ aspectRatio: block.aspect ?? '16/9' }}
					>
						<MediaSlot
							src={block.src}
							alt={block.alt}
							label="Diagram pending"
						/>
					</div>
					{block.caption ? (
						<figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
							{block.caption}
						</figcaption>
					) : null}
				</figure>
			);

		case 'code':
			return (
				<div className="mt-8 overflow-hidden rounded-lg border border-border bg-card/60">
					<div className="flex items-center justify-between border-b border-border px-4 py-2">
						<span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
							{block.language}
						</span>
					</div>
					{/* Scrolls inside its own box; the page body never does. */}
					<pre className="overflow-x-auto px-4 py-4">
						<code className="font-mono text-sm leading-relaxed text-foreground">
							{block.code}
						</code>
					</pre>
				</div>
			);
	}
}
