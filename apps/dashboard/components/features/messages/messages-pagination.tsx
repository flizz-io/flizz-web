import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { contactMessagesMessages } from '@/constants/contact-messages';
import { inboxHref, type InboxParams } from '@/utils/contact-messages';
import { Button } from '@workspace/ui/components/button';

const messages = contactMessagesMessages;

interface MessagesPaginationProps extends InboxParams {
	total: number;
	pageSize: number;
}

/** Previous / next, shown only when there's more than one page. */
export function MessagesPagination({
	folder,
	search,
	page,
	total,
	pageSize
}: MessagesPaginationProps) {
	const pages = Math.max(1, Math.ceil(total / pageSize));
	if (pages <= 1) return null;

	return (
		<nav
			aria-label="Pages"
			className="flex items-center justify-between gap-4"
		>
			<p className="text-sm text-muted-foreground">
				{messages.pageOf(page, pages)}
			</p>
			<div className="flex gap-2">
				<Button
					asChild={page > 1}
					variant="outline"
					size="sm"
					disabled={page <= 1}
				>
					{page > 1 ? (
						<Link
							href={inboxHref({ folder, search, page: page - 1 })}
						>
							<ChevronLeft />
							{messages.previous}
						</Link>
					) : (
						<span>
							<ChevronLeft />
							{messages.previous}
						</span>
					)}
				</Button>
				<Button
					asChild={page < pages}
					variant="outline"
					size="sm"
					disabled={page >= pages}
				>
					{page < pages ? (
						<Link
							href={inboxHref({ folder, search, page: page + 1 })}
						>
							{messages.next}
							<ChevronRight />
						</Link>
					) : (
						<span>
							{messages.next}
							<ChevronRight />
						</span>
					)}
				</Button>
			</div>
		</nav>
	);
}
