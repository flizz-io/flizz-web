import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { articlePath, articlesMessages } from '@/constants/articles';
import type { ArticleListItem } from '@workspace/api-services';

const THUMB_WIDTH = 64;
const THUMB_HEIGHT = 36;

/** Cover thumbnail, title and slug — the first column of the Articles table. */
export function ArticleCell({ article }: { article: ArticleListItem }) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex aspect-video w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
				{article.coverUrl ? (
					<Image
						src={article.coverUrl}
						alt=""
						width={THUMB_WIDTH}
						height={THUMB_HEIGHT}
						className="size-full object-cover"
						unoptimized
					/>
				) : (
					<ImageOff
						className="size-4 text-muted-foreground"
						aria-label={articlesMessages.noCover}
					/>
				)}
			</div>
			<div className="min-w-0">
				<Link
					href={articlePath(article.uuid)}
					className="block truncate font-medium hover:underline"
				>
					{article.title}
				</Link>
				<p className="truncate text-sm text-muted-foreground">
					/{article.slug}
				</p>
			</div>
		</div>
	);
}
