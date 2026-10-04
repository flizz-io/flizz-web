import { ArrowDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';

import { ServiceStatusBadge } from '@/components/features/services/service-status-badge';
import { servicePath, servicesMessages } from '@/constants/services';
import { relativeTime } from '@/utils/relative-time';
import type { ServiceListItem } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@workspace/ui/components/table';

interface ServiceCategoryGroupProps {
	title: string;
	services: ServiceListItem[];
	/** Shows the move buttons. */
	canReorder: boolean;
	busy: boolean;
	onMove: (index: number, offset: number) => void;
}

const messages = servicesMessages;

const COLUMN_COUNT = 6;

/** One category's services, in website order. */
export function ServiceCategoryGroup({
	title,
	services,
	canReorder,
	busy,
	onMove
}: ServiceCategoryGroupProps) {
	return (
		<section className="flex flex-col gap-2">
			<h2 className="text-lg font-semibold tracking-tight">{title}</h2>
			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-10">
								{messages.columns.order}
							</TableHead>
							<TableHead>{messages.columns.service}</TableHead>
							<TableHead>{messages.columns.status}</TableHead>
							<TableHead className="hidden sm:table-cell">
								{messages.columns.projects}
							</TableHead>
							<TableHead className="hidden lg:table-cell">
								{messages.columns.updated}
							</TableHead>
							<TableHead className="w-24 text-right">
								{canReorder ? messages.columns.move : null}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{services.length ? (
							services.map((service, index) => (
								<TableRow key={service.uuid}>
									<TableCell className="text-muted-foreground tabular-nums">
										{index + 1}
									</TableCell>
									<TableCell className="max-w-80">
										<Link
											href={servicePath(service.uuid)}
											className="block truncate font-medium hover:underline"
										>
											{service.title}
										</Link>
										<p className="truncate text-sm text-muted-foreground">
											/{service.slug} ·{' '}
											{service.visualKind}
										</p>
									</TableCell>
									<TableCell>
										<ServiceStatusBadge
											status={service.status}
										/>
									</TableCell>
									<TableCell className="hidden text-muted-foreground sm:table-cell">
										{messages.projects(
											service.projectCount
										)}
									</TableCell>
									<TableCell className="hidden text-muted-foreground lg:table-cell">
										{messages.updatedBy(
											service.updatedBy?.name ?? '—',
											relativeTime(service.updatedAt)
										)}
									</TableCell>
									<TableCell className="text-right">
										{canReorder ? (
											<div className="inline-flex gap-1">
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													disabled={
														busy || index === 0
													}
													onClick={() =>
														onMove(index, -1)
													}
													aria-label={messages.moveUp(
														service.title
													)}
													title={messages.moveUp(
														service.title
													)}
												>
													<ArrowUp />
												</Button>
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													disabled={
														busy ||
														index ===
															services.length - 1
													}
													onClick={() =>
														onMove(index, 1)
													}
													aria-label={messages.moveDown(
														service.title
													)}
													title={messages.moveDown(
														service.title
													)}
												>
													<ArrowDown />
												</Button>
											</div>
										) : null}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={COLUMN_COUNT}
									className="py-6 text-center text-muted-foreground"
								>
									{messages.emptyCategory}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</section>
	);
}
