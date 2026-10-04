import type { Metadata } from 'next';

import { MarketingShell } from '@/components/snippets/marketing-shell/marketing-shell';
import { NotFoundContent } from '@/components/snippets/status-page/not-found-content';
import { notFoundCopy } from '@/constants/status-pages';

export const metadata: Metadata = {
	title: notFoundCopy.metaTitle,
	robots: { index: false }
};

/** A URL that matches no route — outside every layout but the root one. */
export default function NotFound() {
	return (
		<MarketingShell>
			<NotFoundContent />
		</MarketingShell>
	);
}
