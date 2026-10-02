'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { assignableRoles, roleLabels, teamMessages } from '@/constants/team';
import { UserRole } from '@/enums/user';
import type { TeamUser } from '@/types/team';
import { ApiError } from '@/utils/api-error';
import { clientApi } from '@/utils/client-api';
import { relativeTime } from '@/utils/relative-time';
import type { TeamActions } from '@/utils/team-rules';
import { displayName } from '@/utils/user-display';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
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
import { Separator } from '@workspace/ui/components/separator';

interface EditMemberDialogProps {
	user: TeamUser;
	actions: TeamActions;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface EditableFields {
	role: UserRole;
	designation: string;
	showOnWebsite: boolean;
	isFounder: boolean;
	displayOrder: string;
}

const FIELD = {
	role: 'edit-member-role',
	designation: 'edit-member-designation',
	showOnWebsite: 'edit-member-show',
	isFounder: 'edit-member-founder',
	displayOrder: 'edit-member-order'
} as const;

function fieldsOf(user: TeamUser): EditableFields {
	return {
		role: user.role,
		designation: user.designation ?? '',
		showOnWebsite: user.showOnWebsite,
		isFounder: user.isFounder,
		displayOrder: String(user.displayOrder)
	};
}

/**
 * Role, designation and About-page settings — only changed fields are sent.
 * Mount it only while open: its state starts from the saved values.
 */
export function EditMemberDialog({
	user,
	actions,
	open,
	onOpenChange
}: EditMemberDialogProps) {
	const router = useRouter();
	const name = displayName(user);
	const [fields, setFields] = useState<EditableFields>(() => fieldsOf(user));
	const [pending, setPending] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	const update = <Key extends keyof EditableFields>(
		key: Key,
		value: EditableFields[Key]
	) => setFields((current) => ({ ...current, [key]: value }));

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const saved = fieldsOf(user);
		const changes = Object.fromEntries(
			Object.entries({
				role: fields.role,
				designation: fields.designation.trim(),
				showOnWebsite: fields.showOnWebsite,
				isFounder: fields.isFounder,
				displayOrder: Number(fields.displayOrder)
			}).filter(([key, value]) => {
				const before = saved[key as keyof EditableFields];
				return key === 'displayOrder'
					? value !== Number(before)
					: key === 'designation'
						? value !== String(before).trim()
						: value !== before;
			})
		);

		if (!Object.keys(changes).length) {
			onOpenChange(false);
			return;
		}

		setPending(true);
		setFormError(null);
		setFieldErrors({});
		try {
			await clientApi<TeamUser>(`/users/${user.uuid}`, {
				method: 'PATCH',
				body: changes
			});
			toast.success(teamMessages.edit.saved(name));
			onOpenChange(false);
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

	const lockedReason = actions.roleLockedReason
		? teamMessages.edit.roleLocked[actions.roleLockedReason]
		: null;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-lg">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-5"
					noValidate
				>
					<DialogHeader>
						<DialogTitle>
							{teamMessages.edit.title(name)}
						</DialogTitle>
						<DialogDescription>
							{teamMessages.edit.lead}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor={FIELD.role}>
								{teamMessages.roleLabel}
							</Label>
							{actions.canChangeRole ? (
								<Select
									value={fields.role}
									onValueChange={(value) =>
										update('role', value as UserRole)
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
							) : (
								<>
									<Input
										id={FIELD.role}
										value={roleLabels[user.role]}
										disabled
									/>
									{lockedReason ? (
										<p className="text-xs text-muted-foreground">
											{lockedReason}
										</p>
									) : null}
								</>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor={FIELD.designation}>
								{teamMessages.designationLabel}
							</Label>
							<Input
								id={FIELD.designation}
								value={fields.designation}
								onChange={(event) =>
									update('designation', event.target.value)
								}
								placeholder={
									teamMessages.designationPlaceholder
								}
								maxLength={120}
								aria-invalid={Boolean(fieldErrors.designation)}
							/>
							{fieldErrors.designation ? (
								<p className="text-sm text-destructive">
									{fieldErrors.designation}
								</p>
							) : null}
						</div>
					</div>

					<Separator />

					<fieldset className="flex flex-col gap-4">
						<legend className="mb-3 text-sm font-medium">
							{teamMessages.edit.websiteSection}
						</legend>
						<div className="flex items-start gap-3">
							<Checkbox
								id={FIELD.showOnWebsite}
								checked={fields.showOnWebsite}
								onCheckedChange={(checked) =>
									update('showOnWebsite', checked === true)
								}
							/>
							<div className="grid gap-1">
								<Label htmlFor={FIELD.showOnWebsite}>
									{teamMessages.edit.showOnWebsite}
								</Label>
								<p className="text-xs text-muted-foreground">
									{teamMessages.edit.showOnWebsiteHint}
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Checkbox
								id={FIELD.isFounder}
								checked={fields.isFounder}
								onCheckedChange={(checked) =>
									update('isFounder', checked === true)
								}
							/>
							<div className="grid gap-1">
								<Label htmlFor={FIELD.isFounder}>
									{teamMessages.edit.isFounder}
								</Label>
								<p className="text-xs text-muted-foreground">
									{teamMessages.edit.isFounderHint}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 sm:w-40">
							<Label htmlFor={FIELD.displayOrder}>
								{teamMessages.edit.displayOrder}
							</Label>
							<Input
								id={FIELD.displayOrder}
								type="number"
								min={0}
								max={10000}
								value={fields.displayOrder}
								onChange={(event) =>
									update('displayOrder', event.target.value)
								}
								aria-invalid={Boolean(fieldErrors.displayOrder)}
							/>
							<p className="text-xs text-muted-foreground">
								{fieldErrors.displayOrder ??
									teamMessages.edit.displayOrderHint}
							</p>
						</div>
					</fieldset>

					{formError ? (
						<p
							role="alert"
							className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
						>
							{formError}
						</p>
					) : null}

					<div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
						<span>
							{user.createdBy
								? teamMessages.edit.createdBy(
										user.createdBy.name,
										relativeTime(user.createdAt)
									)
								: teamMessages.edit.createdBySetup(
										relativeTime(user.createdAt)
									)}
						</span>
						{user.updatedBy ? (
							<span>
								{teamMessages.edit.updatedBy(
									user.updatedBy.name,
									relativeTime(user.updatedAt)
								)}
							</span>
						) : null}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							{teamMessages.cancel}
						</Button>
						<Button
							type="submit"
							disabled={pending}
						>
							{teamMessages.edit.save}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
