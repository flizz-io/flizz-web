'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import {
	featureLabels,
	featureOrder,
	grantActionLabels,
	grantActions,
	permissionMessages
} from '@/constants/permissions';
import type { GrantAction } from '@/constants/permissions';
import type { TeamUser } from '@/types/team';
import { clientApi } from '@/utils/client-api';
import {
	grantSummary,
	sameGrid,
	setAllGrants,
	toggleGrant
} from '@/utils/permission-grid';
import { displayName } from '@/utils/user-display';
import type { Feature, PermissionMap } from '@workspace/api-services';
import { ApiError, HttpMethod } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle
} from '@workspace/ui/components/sheet';

interface PermissionsDrawerProps {
	user: TeamUser;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/**
 * A Team Member's feature × action grid. Saved as a whole — the API replaces
 * the grid in one go. Mount it only while open: it starts from saved values.
 */
export function PermissionsDrawer({
	user,
	open,
	onOpenChange
}: PermissionsDrawerProps) {
	const router = useRouter();
	const name = displayName(user);
	const [grid, setGrid] = useState<PermissionMap>(user.permissions);
	const [pending, setPending] = useState(false);
	const dirty = !sameGrid(grid, user.permissions);

	const toggle = (feature: Feature, action: GrantAction, checked: boolean) =>
		setGrid((current) => ({
			...current,
			[feature]: toggleGrant(current[feature], action, checked)
		}));

	const toggleAll = (feature: Feature, checked: boolean) =>
		setGrid((current) => ({
			...current,
			[feature]: setAllGrants(checked)
		}));

	const save = async () => {
		setPending(true);
		try {
			await clientApi<TeamUser>(`/users/${user.uuid}/permissions`, {
				method: HttpMethod.PUT,
				body: { permissions: grid }
			});
			toast.success(permissionMessages.saved(name));
			onOpenChange(false);
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
		} finally {
			setPending(false);
		}
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => !pending && onOpenChange(next)}
		>
			<SheetContent className="w-full gap-0 sm:max-w-xl">
				<SheetHeader className="border-b">
					<SheetTitle>{permissionMessages.title(name)}</SheetTitle>
					<SheetDescription>
						{permissionMessages.lead}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto p-4">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b text-left text-muted-foreground">
								<th className="py-2 pr-2 font-medium">
									{permissionMessages.featureColumn}
								</th>
								{grantActions.map((action) => (
									<th
										key={action}
										className="w-16 py-2 text-center font-medium"
									>
										{grantActionLabels[action]}
									</th>
								))}
								<th className="w-14 py-2 text-center font-medium">
									{permissionMessages.allColumn}
								</th>
							</tr>
						</thead>
						<tbody>
							{featureOrder.map((feature) => {
								const label = featureLabels[feature];

								return (
									<tr
										key={feature}
										className="border-b last:border-0"
									>
										<th
											scope="row"
											className="py-3 pr-2 text-left font-medium"
										>
											{label}
										</th>
										{grantActions.map((action) => (
											<td
												key={action}
												className="py-3 text-center"
											>
												<Checkbox
													checked={
														grid[feature][action]
													}
													onCheckedChange={(
														checked
													) =>
														toggle(
															feature,
															action,
															checked === true
														)
													}
													aria-label={permissionMessages.toggle(
														grantActionLabels[
															action
														],
														label
													)}
												/>
											</td>
										))}
										<td className="border-l py-3 text-center">
											<Checkbox
												checked={grantSummary(
													grid[feature]
												)}
												onCheckedChange={(checked) =>
													toggleAll(
														feature,
														checked === true
													)
												}
												aria-label={permissionMessages.allFor(
													label
												)}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<SheetFooter className="flex-row items-center justify-end gap-2 border-t">
					{dirty ? (
						<span className="mr-auto text-xs text-muted-foreground">
							{permissionMessages.unsaved}
						</span>
					) : null}
					<Button
						variant="outline"
						disabled={pending}
						onClick={() => onOpenChange(false)}
					>
						{permissionMessages.cancel}
					</Button>
					<Button
						disabled={pending || !dirty}
						onClick={save}
					>
						{permissionMessages.save}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
