import { Eye, Heart, Link2 } from 'lucide-react';

import { siteConfig } from '@/configs/site';
import type {
	ArticleEngagement,
	ArticleEngagementOptions
} from '@/types/engagement';
import { cn } from '@workspace/ui/lib/utils';

interface ArticleEngagementBarProps {
	slug: string;
	title: string;
	engagement: ArticleEngagement;
	options?: ArticleEngagementOptions;
	className?: string;
}

/** 2,847 → 2.8k. Long counts read as noise beside a heart. */
function formatCount(value: number): string {
	if (value < 1000) return String(value);

	return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}

/**
 * Views, reactions and share, in one strip under the article.
 *
 * Nothing here is wired. The count is static and the heart does not record
 * anything, so it is rendered as a button that is explicitly disabled rather
 * than one that silently swallows the click — a control that looks live and
 * does nothing is worse than one that says it is not ready yet.
 *
 * Sharing is the exception: those are ordinary URLs and work today.
 */
export function ArticleEngagementBar({
	slug,
	title,
	engagement,
	options,
	className
}: ArticleEngagementBarProps) {
	const showViews = options?.views ?? true;
	const showReactions = options?.reactions ?? true;
	const showShare = options?.share ?? true;

	if (!showViews && !showReactions && !showShare) return null;

	const url = `${siteConfig.url}/articles/${slug}`;
	const shareText = encodeURIComponent(title);
	const shareUrl = encodeURIComponent(url);

	const shareLinks = [
		{
			label: 'Share on X',
			href: `https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
			icon: (
				<svg
					viewBox="0 0 24 24"
					aria-hidden
					className="size-3.5 fill-current"
				>
					<path d="M18.9 2H22l-7.1 8.1L23.2 22h-6.6l-5.2-6.8L5.5 22H2.4l7.6-8.7L1.2 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z" />
				</svg>
			)
		},
		{
			label: 'Share on LinkedIn',
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
			// lucide ships no LinkedIn mark, and neither brand glyph belongs in
			// an icon set anyway — both are inlined so they stay consistent.
			icon: (
				<svg
					viewBox="0 0 24 24"
					aria-hidden
					className="size-3.5 fill-current"
				>
					<path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.3c0-1.27-.02-2.9-1.9-2.9-1.9 0-2.2 1.38-2.2 2.8V21h-4V9.5Z" />
				</svg>
			)
		}
	];

	return (
		<div
			className={cn(
				'mx-auto flex max-w-2xl flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-6',
				className
			)}
		>
			{showReactions ? (
				<button
					type="button"
					disabled
					title="Reactions arrive with the API"
					className="group/heart inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase disabled:cursor-not-allowed"
				>
					<Heart className="size-3.5 text-primary" />
					{formatCount(engagement.reactions)}
				</button>
			) : null}

			{showViews ? (
				<span className="inline-flex items-center gap-2 font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
					<Eye className="size-3.5" />
					{formatCount(engagement.views)} views
				</span>
			) : null}

			{showShare ? (
				<div className="ml-auto flex items-center gap-2">
					<span className="mr-1 font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
						Share
					</span>
					{shareLinks.map((link) => (
						<a
							key={link.label}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={link.label}
							className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
						>
							{link.icon}
						</a>
					))}
					{/* Copying needs a client component; the canonical link is
					    given plainly instead so the URL is still obtainable. */}
					<a
						href={url}
						aria-label="Permanent link to this article"
						className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
					>
						<Link2 className="size-3.5" />
					</a>
				</div>
			) : null}
		</div>
	);
}
