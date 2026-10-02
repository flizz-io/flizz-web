'use client';

import { LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { loginPath, profilePath } from '@/constants/auth';
import { shellMessages } from '@/constants/messages';
import { displayName, initials } from '@/utils/user-display';
import type { AuthUser } from '@workspace/api-services';
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';

interface UserMenuProps {
	user: AuthUser;
}

/** The signed-in user's avatar, with who they are and sign-out. */
export function UserMenu({ user }: UserMenuProps) {
	const router = useRouter();
	const [signingOut, setSigningOut] = useState(false);

	const signOut = async () => {
		setSigningOut(true);
		// Signed out either way — a failed request still leaves for /login.
		await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
		router.replace(loginPath);
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label={displayName(user)}
				>
					<Avatar className="size-8">
						{user.avatarUrl ? (
							<AvatarImage
								src={user.avatarUrl}
								alt=""
								referrerPolicy="no-referrer"
							/>
						) : null}
						<AvatarFallback>{initials(user)}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-60"
			>
				<DropdownMenuLabel className="flex flex-col gap-0.5">
					<span className="truncate font-medium">
						{displayName(user)}
					</span>
					<span className="truncate text-xs font-normal text-muted-foreground">
						{user.email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={profilePath}>
						<UserRound />
						{shellMessages.myProfile}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={signingOut}
					onSelect={signOut}
				>
					<LogOut />
					{shellMessages.signOut}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
