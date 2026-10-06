'use client';

import { useEffect } from 'react';

import { useConsent } from '@/contexts/consent-context';
import type { ContentType } from '@/enums/analytics';
import { ConsentChoice } from '@/enums/consent';
import { trackContentView } from '@/utils/analytics';

interface TrackContentViewProps {
	type: ContentType;
	/** The item's slug. */
	id: string;
	name: string;
}

/**
 * Counts a view of a service, article or project detail page — GA4
 * `view_item`, Meta `ViewContent`. Waits for consent, so a visitor who
 * accepts on this page still counts it. Renders nothing.
 */
export function TrackContentView({ type, id, name }: TrackContentViewProps) {
	const { choice } = useConsent();
	const accepted = choice === ConsentChoice.ACCEPTED;

	useEffect(() => {
		if (accepted) trackContentView(type, id, name);
	}, [accepted, type, id, name]);

	return null;
}
