'use client';

import { ArrowLeft, RotateCw } from 'lucide-react';
import Link from 'next/link';

import { StatusPage } from '@/components/snippets/status-page/status-page';
import { errorCopy } from '@/constants/status-pages';
import { Button } from '@workspace/ui/components/button';

/** The error message, with a retry that re-renders the failed segment. */
export function ErrorContent({ onRetry }: { onRetry: () => void }) {
	return (
		<StatusPage
			code={errorCopy.code}
			title={errorCopy.title}
			lead={errorCopy.lead}
		>
			<div className="mt-10 flex flex-wrap items-center gap-6">
				<Button
					type="button"
					size="lg"
					onClick={onRetry}
				>
					<RotateCw />
					{errorCopy.retry}
				</Button>
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
				>
					<ArrowLeft className="size-4" />
					{errorCopy.home}
				</Link>
			</div>
		</StatusPage>
	);
}
