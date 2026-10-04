import Link from 'next/link';

import { MessageStatusBadge } from '@/components/features/messages/message-status-badge';
import {
	contactMessagesMessages,
	contactScopeLabels,
	messagePath
} from '@/constants/contact-messages';
import { relativeTime } from '@/utils/relative-time';
import {
	ContactMessageStatus,
	type ContactFolder,
	type ContactMessageListItem
} from '@workspace/api-services';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@workspace/ui/components/table';
import { cn } from '@workspace/ui/lib/utils';

const COLUMN_COUNT = 5;

const messages = contactMessagesMessages;

interface MessagesTableProps {
	items: ContactMessageListItem[];
	folder: ContactFolder;
	search: string;
}

/** One page of the inbox, newest first; unread rows stand out. */
export function MessagesTable({ items, folder, search }: MessagesTableProps) {
	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{messages.columns.from}</TableHead>
						<TableHead className="hidden md:table-cell">
							{messages.columns.project}
						</TableHead>
						<TableHead className="hidden lg:table-cell">
							{messages.columns.message}
						</TableHead>
						<TableHead>{messages.columns.received}</TableHead>
						<TableHead>{messages.columns.status}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.length ? (
						items.map((item) => {
							const unread =
								item.status === ContactMessageStatus.NEW;

							return (
								<TableRow
									key={item.uuid}
									className={cn(unread && 'bg-primary/5')}
								>
									<TableCell className="max-w-64">
										<div className="flex items-start gap-2">
											<span
												className={cn(
													'mt-2 size-2 shrink-0 rounded-full',
													unread
														? 'bg-primary'
														: 'bg-transparent'
												)}
											>
												{unread ? (
													<span className="sr-only">
														{messages.unread}
													</span>
												) : null}
											</span>
											<div className="min-w-0">
												<Link
													href={messagePath(
														item.uuid
													)}
													className={cn(
														'block truncate hover:underline',
														unread
															? 'font-semibold'
															: 'font-medium'
													)}
												>
													{item.name}
													{item.company
														? ` · ${item.company}`
														: ''}
												</Link>
												<p className="truncate text-sm text-muted-foreground">
													{item.email}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell className="hidden text-muted-foreground md:table-cell">
										{contactScopeLabels[item.scope]}
									</TableCell>
									<TableCell className="hidden max-w-96 lg:table-cell">
										<p className="truncate text-muted-foreground">
											{item.excerpt}
										</p>
									</TableCell>
									<TableCell className="whitespace-nowrap text-muted-foreground">
										<time dateTime={item.createdAt}>
											{relativeTime(item.createdAt)}
										</time>
									</TableCell>
									<TableCell>
										<MessageStatusBadge
											status={item.status}
										/>
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell
								colSpan={COLUMN_COUNT}
								className="py-10 text-center text-muted-foreground"
							>
								{search
									? messages.noResults(search)
									: messages.empty[folder]}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
