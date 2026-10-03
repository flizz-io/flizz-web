import { commonMessages } from '@/constants/messages';
import { relativeTime } from '@/utils/relative-time';
import type { UserReference } from '@workspace/api-services';

interface RecordAuthorshipProps {
	createdBy: UserReference | null;
	createdAt: string;
	updatedBy: UserReference | null;
	updatedAt: string;
}

/** "Created by … · Last changed by …" under a record's title. */
export function RecordAuthorship({
	createdBy,
	createdAt,
	updatedBy,
	updatedAt
}: RecordAuthorshipProps) {
	const { createdByLine, updatedByLine, someone } = commonMessages;

	return (
		<p className="text-sm text-muted-foreground">
			{createdByLine(createdBy?.name ?? someone, relativeTime(createdAt))}
			{' · '}
			{updatedByLine(updatedBy?.name ?? someone, relativeTime(updatedAt))}
		</p>
	);
}
