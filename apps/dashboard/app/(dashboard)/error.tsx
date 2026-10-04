'use client';

import { useEffect } from 'react';

import { ErrorCard } from '@/components/snippets/status-card/error-card';

interface DashboardErrorProps {
	error: Error & { digest?: string };
	unstable_retry: () => void;
}

/** A screen that threw — the sidebar stays, so the rest still works. */
export default function DashboardError({
	error,
	unstable_retry
}: DashboardErrorProps) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return <ErrorCard onRetry={unstable_retry} />;
}
