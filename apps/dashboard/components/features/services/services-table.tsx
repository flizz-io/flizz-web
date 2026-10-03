'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ServiceCategoryGroup } from '@/components/features/services/service-category-group';
import { allFilterValue } from '@/constants/filters';
import {
	serviceCategoryLabels,
	serviceStatusLabels,
	servicesMessages
} from '@/constants/services';
import { moveItem } from '@/utils/list-items';
import {
	ApiError,
	PublishStatus,
	reorderServicesService,
	ServiceCategory,
	type ServiceListItem
} from '@workspace/api-services';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';

interface ServicesTableProps {
	services: ServiceListItem[];
	/** Shows the reorder buttons. */
	canEdit: boolean;
}

type StatusFilter = PublishStatus | typeof allFilterValue;

const messages = servicesMessages;

function matches(service: ServiceListItem, query: string) {
	if (!query) return true;
	const haystack = `${service.title} ${service.slug}`.toLowerCase();

	return haystack.includes(query.toLowerCase());
}

/**
 * The Services list — four category groups in website order. A catalogue is
 * a dozen services, so it's loaded once and filtered here. Reordering works
 * on the whole category, so it's paused while a filter hides some of it.
 */
export function ServicesTable({ services, canEdit }: ServicesTableProps) {
	const [rows, setRows] = useState(services);
	const [query, setQuery] = useState('');
	const [status, setStatus] = useState<StatusFilter>(allFilterValue);
	const [busy, setBusy] = useState(false);
	const filtering = Boolean(query.trim()) || status !== allFilterValue;

	const groups = useMemo(
		() =>
			Object.values(ServiceCategory).map((category) => ({
				category,
				services: rows.filter(
					(service) =>
						service.category === category &&
						matches(service, query.trim()) &&
						(status === allFilterValue || service.status === status)
				)
			})),
		[rows, query, status]
	);

	const move = async (
		category: ServiceCategory,
		index: number,
		offset: number
	) => {
		const inCategory = rows.filter(
			(service) => service.category === category
		);
		const serviceUuids = moveItem(inCategory, index, offset).map(
			(service) => service.uuid
		);
		setBusy(true);
		try {
			const reordered = await reorderServicesService({
				category,
				serviceUuids
			});
			setRows((current) => [
				...current.filter((service) => service.category !== category),
				...reordered
			]);
			toast.success(messages.reordered(serviceCategoryLabels[category]));
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative sm:w-72">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={messages.searchPlaceholder}
						aria-label={messages.searchPlaceholder}
						className="pl-9"
					/>
				</div>
				<Select
					value={status}
					onValueChange={(value) => setStatus(value as StatusFilter)}
				>
					<SelectTrigger
						className="sm:w-44"
						aria-label={messages.anyStatus}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={allFilterValue}>
							{messages.anyStatus}
						</SelectItem>
						{Object.values(PublishStatus).map((option) => (
							<SelectItem
								key={option}
								value={option}
							>
								{serviceStatusLabels[option]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{canEdit && filtering ? (
					<p className="text-sm text-muted-foreground">
						{messages.reorderPaused}
					</p>
				) : null}
			</div>

			{rows.length ? (
				groups.map((group) => (
					<ServiceCategoryGroup
						key={group.category}
						title={serviceCategoryLabels[group.category]}
						services={group.services}
						canReorder={canEdit && !filtering}
						busy={busy}
						onMove={(index, offset) =>
							move(group.category, index, offset)
						}
					/>
				))
			) : (
				<p className="py-10 text-center text-muted-foreground">
					{messages.noServices}
				</p>
			)}
		</div>
	);
}
