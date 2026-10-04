'use client';

import type { ReactNode } from 'react';

import { useConsent } from '@/contexts/consent-context';
import { ConsentChoice } from '@/enums/consent';

/**
 * Renders its children only once the visitor has accepted — GA and the Meta
 * Pixel go inside (docs/guides/analytics.md). Rejected, undecided or not yet
 * read: nothing loads, so no tracking cookie is ever set without consent.
 */
export function WithConsent({ children }: { children: ReactNode }) {
	const { choice } = useConsent();

	return choice === ConsentChoice.ACCEPTED ? children : null;
}
