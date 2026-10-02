import type { ReactNode } from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@workspace/ui/components/card';

interface SectionCardProps {
	title: string;
	description?: string;
	children?: ReactNode;
}

/** One section of the project form. */
export function SectionCard({
	title,
	description,
	children
}: SectionCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description ? (
					<CardDescription>{description}</CardDescription>
				) : null}
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				{children}
			</CardContent>
		</Card>
	);
}
