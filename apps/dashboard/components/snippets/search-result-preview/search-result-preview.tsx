import { seoMessages } from '@/constants/seo';

interface SearchResultPreviewProps {
	url: string;
	title: string;
	description: string;
}

/** Roughly how the page reads as a search result — title, URL, snippet. */
export function SearchResultPreview({
	url,
	title,
	description
}: SearchResultPreviewProps) {
	return (
		<figure className="flex flex-col gap-2">
			<figcaption className="text-sm font-medium">
				{seoMessages.searchPreview}
			</figcaption>
			<div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-4">
				<p className="truncate text-xs text-muted-foreground">{url}</p>
				<p className="line-clamp-1 text-lg text-blue-700 dark:text-blue-400">
					{title}
				</p>
				<p className="line-clamp-2 text-sm text-muted-foreground">
					{description}
				</p>
			</div>
		</figure>
	);
}
