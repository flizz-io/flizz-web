'use client';

import { RotateCw } from 'lucide-react';
import Link from 'next/link';

import { StatusCard } from '@/components/snippets/status-card/status-card';
import { errorMessages } from '@/constants/status-pages';
import { Button } from '@workspace/ui/components/button';

/** The error message, with a retry that re-renders the failed segment. */
export function ErrorCard({ onRetry }: { onRetry: () => void }) {
	return (
		<StatusCard
			title={errorMessages.title}
			body={errorMessages.body}
		>
			<Button
				type="button"
				onClick={onRetry}
			>
				<RotateCw />
				{errorMessages.retry}
			</Button>
			<Button
				asChild
				variant="outline"
			>
				<Link href={errorMessages.homeHref}>{errorMessages.home}</Link>
			</Button>
		</StatusCard>
	);
}
