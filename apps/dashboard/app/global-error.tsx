'use client';

import '@workspace/ui/globals.css';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

import { ErrorCard } from '@/components/snippets/status-card/error-card';

interface GlobalErrorProps {
	error: Error & { digest?: string };
	unstable_retry: () => void;
}

/** The root layout itself failed, so this replaces it with its own `<html>`. */
export default function GlobalError({
	error,
	unstable_retry
}: GlobalErrorProps) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body className="flex min-h-svh bg-background font-sans text-foreground antialiased">
				<ErrorCard onRetry={unstable_retry} />
			</body>
		</html>
	);
}
