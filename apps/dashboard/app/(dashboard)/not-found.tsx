import type { Metadata } from 'next';

import { NotFoundCard } from '@/components/snippets/status-card/not-found-card';
import { notFoundMessages } from '@/constants/status-pages';

export const metadata: Metadata = { title: notFoundMessages.metaTitle };

/** A page that called `notFound()` — inside the sidebar layout. */
export default function NotFound() {
	return <NotFoundCard />;
}
