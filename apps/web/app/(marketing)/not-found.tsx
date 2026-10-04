import type { Metadata } from 'next';

import { NotFoundContent } from '@/components/snippets/status-page/not-found-content';
import { notFoundCopy } from '@/constants/status-pages';

export const metadata: Metadata = {
	title: notFoundCopy.metaTitle,
	robots: { index: false }
};

/** A page that called `notFound()` — inside the marketing layout already. */
export default function MarketingNotFound() {
	return <NotFoundContent />;
}
