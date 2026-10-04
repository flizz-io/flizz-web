'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

import { ErrorContent } from '@/components/snippets/status-page/error-content';

interface MarketingErrorProps {
	error: Error & { digest?: string };
	unstable_retry: () => void;
}

/** A page that threw — header and footer stay, the content says what happened. */
export default function MarketingError({
	error,
	unstable_retry
}: MarketingErrorProps) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return <ErrorContent onRetry={unstable_retry} />;
}
