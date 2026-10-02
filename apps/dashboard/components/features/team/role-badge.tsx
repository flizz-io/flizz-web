import { roleLabels } from '@/constants/team';
import { UserRole } from '@workspace/api-services';
import { Badge } from '@workspace/ui/components/badge';

const roleVariant = {
	[UserRole.SUPER_ADMIN]: 'default',
	[UserRole.ADMIN]: 'secondary',
	[UserRole.TEAM_MEMBER]: 'outline'
} as const satisfies Record<UserRole, 'default' | 'secondary' | 'outline'>;

export function RoleBadge({ role }: { role: UserRole }) {
	return <Badge variant={roleVariant[role]}>{roleLabels[role]}</Badge>;
}
