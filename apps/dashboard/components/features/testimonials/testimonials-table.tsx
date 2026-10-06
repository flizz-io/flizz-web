'use client';

import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { HighlightedQuote } from '@/components/features/testimonials/highlighted-quote';
import { TestimonialStatusBadge } from '@/components/features/testimonials/testimonial-status-badge';
import { VisibilityBadge } from '@/components/snippets/visibility-badge/visibility-badge';
import { allFilterValue } from '@/constants/filters';
import {
	testimonialPath,
	testimonialStatusLabels,
	testimonialsMessages
} from '@/constants/testimonials';
import { moveItem } from '@/utils/list-items';
import { relativeTime } from '@/utils/relative-time';
import {
	ApiError,
	PublishStatus,
	reorderTestimonialsService,
	type TestimonialListItem
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
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

interface TestimonialsTableProps {
	testimonials: TestimonialListItem[];
	/** Shows the reorder buttons. */
	canEdit: boolean;
}

type StatusFilter = PublishStatus | typeof allFilterValue;

const messages = testimonialsMessages;

const COLUMN_COUNT = 6;

function matches(testimonial: TestimonialListItem, query: string) {
	if (!query) return true;
	const haystack =
		`${testimonial.quote} ${testimonial.authorName} ${testimonial.authorRole}`.toLowerCase();

	return haystack.includes(query.toLowerCase());
}

/**
 * The Testimonials list, in carousel order. A handful of quotes, so it's
 * loaded once and filtered here. Reordering saves the whole list, so it's
 * paused while a filter hides some of it.
 */
export function TestimonialsTable({
	testimonials,
	canEdit
}: TestimonialsTableProps) {
	const [rows, setRows] = useState(testimonials);
	const [query, setQuery] = useState('');
	const [status, setStatus] = useState<StatusFilter>(allFilterValue);
	const [busy, setBusy] = useState(false);
	const filtering = Boolean(query.trim()) || status !== allFilterValue;
	const canReorder = canEdit && !filtering;

	const visible = useMemo(
		() =>
			rows.filter(
				(testimonial) =>
					matches(testimonial, query.trim()) &&
					(status === allFilterValue || testimonial.status === status)
			),
		[rows, query, status]
	);

	const move = async (index: number, offset: number) => {
		const testimonialUuids = moveItem(rows, index, offset).map(
			(testimonial) => testimonial.uuid
		);
		setBusy(true);
		try {
			setRows(await reorderTestimonialsService({ testimonialUuids }));
			toast.success(messages.reordered);
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
		} finally {
			setBusy(false);
		}
	};

	if (!rows.length) {
		return (
			<p className="py-10 text-center text-muted-foreground">
				{messages.noTestimonials}
			</p>
		);
	}

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
								{testimonialStatusLabels[option]}
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

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-10">
								{messages.columns.order}
							</TableHead>
							<TableHead>{messages.columns.quote}</TableHead>
							<TableHead className="hidden md:table-cell">
								{messages.columns.project}
							</TableHead>
							<TableHead>{messages.columns.status}</TableHead>
							<TableHead className="hidden lg:table-cell">
								{messages.columns.updated}
							</TableHead>
							<TableHead className="w-24 text-right">
								{canReorder ? messages.columns.move : null}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{visible.length ? (
							visible.map((testimonial, index) => (
								<TableRow key={testimonial.uuid}>
									<TableCell className="align-top text-muted-foreground tabular-nums">
										{index + 1}
									</TableCell>
									<TableCell className="max-w-md whitespace-normal">
										<Link
											href={testimonialPath(
												testimonial.uuid
											)}
											className="block hover:underline"
										>
											<HighlightedQuote
												quote={testimonial.quote}
												highlights={
													testimonial.highlights
												}
												className="line-clamp-2"
											/>
										</Link>
										<p className="mt-1 truncate text-sm text-muted-foreground">
											{testimonial.authorName} ·{' '}
											{testimonial.authorRole}
										</p>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{testimonial.project ? (
											<div className="flex flex-col items-start gap-1">
												<span className="text-sm">
													{testimonial.project.name}
												</span>
												<VisibilityBadge
													visibility={
														testimonial.project
															.visibility
													}
												/>
											</div>
										) : (
											<span className="text-muted-foreground">
												—
											</span>
										)}
									</TableCell>
									<TableCell>
										<TestimonialStatusBadge
											status={testimonial.status}
										/>
									</TableCell>
									<TableCell className="hidden text-muted-foreground lg:table-cell">
										{messages.updatedBy(
											testimonial.updatedBy?.name ?? '—',
											relativeTime(testimonial.updatedAt)
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
														move(index, -1)
													}
													aria-label={messages.moveUp(
														testimonial.authorName
													)}
													title={messages.moveUp(
														testimonial.authorName
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
															visible.length - 1
													}
													onClick={() =>
														move(index, 1)
													}
													aria-label={messages.moveDown(
														testimonial.authorName
													)}
													title={messages.moveDown(
														testimonial.authorName
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
									{messages.noResults}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
