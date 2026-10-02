'use client';

import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { assignableRoles, roleLabels, teamMessages } from '@/constants/team';
import type { AddTeamUserInput, TeamUser } from '@/types/team';
import { clientApi } from '@/utils/client-api';
import { UserRole, HttpMethod, ApiError } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';

type AssignableRole = AddTeamUserInput['role'];

const FIELD = {
	email: 'add-member-email',
	role: 'add-member-role',
	designation: 'add-member-designation'
} as const;

/** "Add member" — email, role, designation. The new person can sign in at once. */
export function AddMemberDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [role, setRole] = useState<AssignableRole>(UserRole.TEAM_MEMBER);
	const [pending, setPending] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	const reset = () => {
		setRole(UserRole.TEAM_MEMBER);
		setFormError(null);
		setFieldErrors({});
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const input: AddTeamUserInput = {
			email: String(form.get('email') ?? ''),
			role,
			designation: String(form.get('designation') ?? '')
		};

		setPending(true);
		setFormError(null);
		setFieldErrors({});

		try {
			const user = await clientApi<TeamUser>('/users', {
				method: HttpMethod.POST,
				body: input
			});
			toast.success(teamMessages.added(user.email));
			setOpen(false);
			reset();
			router.refresh();
		} catch (error) {
			if (error instanceof ApiError) {
				setFieldErrors(error.fieldErrors);
				setFormError(
					Object.keys(error.fieldErrors).length ? null : error.message
				);
			}
		} finally {
			setPending(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) reset();
			}}
		>
			<DialogTrigger asChild>
				<Button>
					<UserPlus />
					{teamMessages.addMember}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-5"
					noValidate
				>
					<DialogHeader>
						<DialogTitle>{teamMessages.addTitle}</DialogTitle>
						<DialogDescription>
							{teamMessages.addLead}
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-2">
						<Label htmlFor={FIELD.email}>
							{teamMessages.emailLabel}
						</Label>
						<Input
							id={FIELD.email}
							name="email"
							type="email"
							autoComplete="off"
							required
							aria-invalid={Boolean(fieldErrors.email)}
						/>
						{fieldErrors.email ? (
							<p className="text-sm text-destructive">
								{fieldErrors.email}
							</p>
						) : null}
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor={FIELD.role}>
							{teamMessages.roleLabel}
						</Label>
						<Select
							value={role}
							onValueChange={(value) =>
								setRole(value as AssignableRole)
							}
						>
							<SelectTrigger
								id={FIELD.role}
								className="w-full"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{assignableRoles.map((option) => (
									<SelectItem
										key={option}
										value={option}
									>
										{roleLabels[option]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor={FIELD.designation}>
							{teamMessages.designationLabel}{' '}
							<span className="font-normal text-muted-foreground">
								{teamMessages.optional}
							</span>
						</Label>
						<Input
							id={FIELD.designation}
							name="designation"
							placeholder={teamMessages.designationPlaceholder}
							maxLength={120}
							aria-invalid={Boolean(fieldErrors.designation)}
						/>
						{fieldErrors.designation ? (
							<p className="text-sm text-destructive">
								{fieldErrors.designation}
							</p>
						) : null}
					</div>

					{formError ? (
						<p
							role="alert"
							className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
						>
							{formError}
						</p>
					) : null}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							{teamMessages.cancel}
						</Button>
						<Button
							type="submit"
							disabled={pending}
						>
							{teamMessages.addMember}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
