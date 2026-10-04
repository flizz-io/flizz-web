'use client';

import '@workspace/ui/globals.css';
import { useEffect } from 'react';

import { ErrorContent } from '@/components/snippets/status-page/error-content';

interface GlobalErrorProps {
	error: Error & { digest?: string };
	unstable_retry: () => void;
}

/**
 * The root layout itself failed, so this replaces it — its own `<html>`, no
 * header or footer (they may be what broke). Rare; most errors stop at
 * `(marketing)/error.tsx`.
 */
export default function GlobalError({
	error,
	unstable_retry
}: GlobalErrorProps) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html lang="en">
			<body className="bg-background font-sans text-foreground antialiased">
				<ErrorContent onRetry={unstable_retry} />
			</body>
		</html>
	);
}
