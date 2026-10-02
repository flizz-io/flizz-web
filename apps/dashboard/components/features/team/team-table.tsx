'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { LifecycleBadge } from '@/components/features/team/lifecycle-badge';
import { MemberCell } from '@/components/features/team/member-cell';
import { RoleBadge } from '@/components/features/team/role-badge';
import {
	allFilterValue,
	lifecycleLabels,
	roleLabels,
	teamMessages
} from '@/constants/team';
import { UserLifecycle, UserRole } from '@/enums/user';
import type { TeamUser } from '@/types/team';
import { relativeTime } from '@/utils/relative-time';
import { displayName } from '@/utils/user-display';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@workspace/ui/components/table';

interface TeamTableProps {
	users: TeamUser[];
	currentUserUuid: string;
}

type RoleFilter = UserRole | typeof allFilterValue;
type LifecycleFilter = UserLifecycle | typeof allFilterValue;

function matches(user: TeamUser, query: string) {
	if (!query) return true;
	const haystack = `${displayName(user)} ${user.email}`.toLowerCase();

	return haystack.includes(query.toLowerCase());
}

/**
 * The Team list. The whole team is small, so it's loaded once and filtered
 * here — instant, and no round trip per keystroke.
 */
export function TeamTable({ users, currentUserUuid }: TeamTableProps) {
	const [query, setQuery] = useState('');
	const [role, setRole] = useState<RoleFilter>(allFilterValue);
	const [lifecycle, setLifecycle] = useState<LifecycleFilter>(allFilterValue);

	const visible = useMemo(
		() =>
			users.filter(
				(user) =>
					matches(user, query.trim()) &&
					(role === allFilterValue || user.role === role) &&
					(lifecycle === allFilterValue ||
						user.lifecycle === lifecycle)
			),
		[lifecycle, query, role, users]
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative sm:w-72">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={teamMessages.searchPlaceholder}
						aria-label={teamMessages.searchPlaceholder}
						className="pl-9"
					/>
				</div>
				<Select
					value={role}
					onValueChange={(value) => setRole(value as RoleFilter)}
				>
					<SelectTrigger
						className="sm:w-44"
						aria-label={teamMessages.anyRole}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={allFilterValue}>
							{teamMessages.anyRole}
						</SelectItem>
						{Object.values(UserRole).map((option) => (
							<SelectItem
								key={option}
								value={option}
							>
								{roleLabels[option]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					value={lifecycle}
					onValueChange={(value) =>
						setLifecycle(value as LifecycleFilter)
					}
				>
					<SelectTrigger
						className="sm:w-44"
						aria-label={teamMessages.anyStatus}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={allFilterValue}>
							{teamMessages.anyStatus}
						</SelectItem>
						{Object.values(UserLifecycle).map((option) => (
							<SelectItem
								key={option}
								value={option}
							>
								{lifecycleLabels[option]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{teamMessages.columns.member}</TableHead>
							<TableHead>{teamMessages.columns.role}</TableHead>
							<TableHead className="hidden md:table-cell">
								{teamMessages.columns.designation}
							</TableHead>
							<TableHead>{teamMessages.columns.status}</TableHead>
							<TableHead className="hidden lg:table-cell">
								{teamMessages.columns.lastSignIn}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{visible.length ? (
							visible.map((user) => (
								<TableRow key={user.uuid}>
									<TableCell>
										<MemberCell
											user={user}
											isCurrentUser={
												user.uuid === currentUserUuid
											}
										/>
									</TableCell>
									<TableCell>
										<RoleBadge role={user.role} />
									</TableCell>
									<TableCell className="hidden text-muted-foreground md:table-cell">
										{user.designation ?? '—'}
									</TableCell>
									<TableCell>
										<LifecycleBadge
											lifecycle={user.lifecycle}
										/>
									</TableCell>
									<TableCell className="hidden text-muted-foreground lg:table-cell">
										{user.lastLoginAt
											? relativeTime(user.lastLoginAt)
											: teamMessages.neverSignedIn}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={5}
									className="py-10 text-center text-muted-foreground"
								>
									{teamMessages.noResults}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
