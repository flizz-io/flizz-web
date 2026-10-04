import type { ReactNode } from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@workspace/ui/components/card';

interface StatusCardProps {
	title: string;
	body: string;
	/** The way out — buttons or links. */
	children: ReactNode;
}

/** A dashboard 404 or error, centred where the page would have been. */
export function StatusCard({ title, body, children }: StatusCardProps) {
	return (
		<div className="flex flex-1 items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{body}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2">
					{children}
				</CardContent>
			</Card>
		</div>
	);
}
