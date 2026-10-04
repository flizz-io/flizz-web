import Link from 'next/link';

import { StatusCard } from '@/components/snippets/status-card/status-card';
import { notFoundMessages } from '@/constants/status-pages';
import { Button } from '@workspace/ui/components/button';

export function NotFoundCard() {
	return (
		<StatusCard
			title={notFoundMessages.title}
			body={notFoundMessages.body}
		>
			<Button asChild>
				<Link href={notFoundMessages.homeHref}>
					{notFoundMessages.home}
				</Link>
			</Button>
		</StatusCard>
	);
}
