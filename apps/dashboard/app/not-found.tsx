import type { Metadata } from 'next';

import { NotFoundCard } from '@/components/snippets/status-card/not-found-card';
import { notFoundMessages } from '@/constants/status-pages';

export const metadata: Metadata = { title: notFoundMessages.metaTitle };

/** A URL that matches no route — no sidebar, the session may not exist. */
export default function NotFound() {
	return (
		<div className="flex min-h-svh">
			<NotFoundCard />
		</div>
	);
}
