import { teamMessages } from '@/constants/team';
import type { TeamUser } from '@/types/team';
import { displayName, initials } from '@/utils/user-display';
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';

interface MemberCellProps {
	user: TeamUser;
	isCurrentUser: boolean;
}

/** Photo, name and email — the first column of the Team table. */
export function MemberCell({ user, isCurrentUser }: MemberCellProps) {
	const hasName = Boolean(user.firstName || user.lastName);

	return (
		<div className="flex items-center gap-3">
			<Avatar className="size-9">
				{user.avatarUrl ? (
					<AvatarImage
						src={user.avatarUrl}
						alt=""
						referrerPolicy="no-referrer"
					/>
				) : null}
				<AvatarFallback>{initials(user)}</AvatarFallback>
			</Avatar>
			<div className="min-w-0">
				<p className="flex items-center gap-2 truncate font-medium">
					{hasName ? displayName(user) : user.email}
					{isCurrentUser ? (
						<Badge
							variant="outline"
							className="text-[10px]"
						>
							{teamMessages.you}
						</Badge>
					) : null}
				</p>
				{hasName ? (
					<p className="truncate text-sm text-muted-foreground">
						{user.email}
					</p>
				) : null}
			</div>
		</div>
	);
}
