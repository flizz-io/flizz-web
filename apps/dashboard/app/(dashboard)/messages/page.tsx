import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { MessagesFolderTabs } from '@/components/features/messages/messages-folder-tabs';
import { MessagesPagination } from '@/components/features/messages/messages-pagination';
import { MessagesSearch } from '@/components/features/messages/messages-search';
import { MessagesTable } from '@/components/features/messages/messages-table';
import { homePath } from '@/constants/auth';
import { contactMessagesMessages } from '@/constants/contact-messages';
import { parseInboxParams } from '@/utils/contact-messages';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import {
	Feature,
	getContactMessageSummaryService,
	getContactMessagesService
} from '@workspace/api-services';

export const metadata: Metadata = { title: contactMessagesMessages.title };

interface MessagesPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Needs Contact messages › View — anyone else goes back to Overview. */
export default async function MessagesPage({
	searchParams
}: MessagesPageProps) {
	const user = await getCurrentUser();
	if (!user?.permissions[Feature.CONTACT_MESSAGES].view) redirect(homePath);

	const params = parseInboxParams(await searchParams);
	const context = await serverApiContext();
	const [inbox, summary] = await Promise.all([
		serverCall(getContactMessagesService(params, context)),
		serverCall(getContactMessageSummaryService(context))
	]);

	return (
		<>
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					{contactMessagesMessages.title}
				</h1>
				<p className="max-w-prose text-muted-foreground">
					{contactMessagesMessages.lead}
				</p>
			</div>
			<div className="flex flex-col gap-4">
				<MessagesFolderTabs
					current={params.folder}
					search={params.search}
					summary={summary}
				/>
				<MessagesSearch
					folder={params.folder}
					search={params.search}
				/>
				<MessagesTable
					items={inbox.items}
					folder={params.folder}
					search={params.search}
				/>
				<MessagesPagination
					{...params}
					total={inbox.total}
					pageSize={inbox.pageSize}
				/>
			</div>
		</>
	);
}
