import { UserMenu } from '@/components/snippets/user-menu/user-menu';
import type { AuthUser } from '@/types/user';
import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';

interface DashboardHeaderProps {
	user: AuthUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator
				orientation="vertical"
				className="mr-2 data-vertical:h-4 data-vertical:self-center"
			/>
			<div className="ml-auto">
				<UserMenu user={user} />
			</div>
		</header>
	);
}
