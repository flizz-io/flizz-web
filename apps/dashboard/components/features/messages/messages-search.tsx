import { Search } from 'lucide-react';
import Form from 'next/form';
import Link from 'next/link';

import {
	contactMessagesMessages,
	messagesPath
} from '@/constants/contact-messages';
import { inboxHref } from '@/utils/contact-messages';
import { ContactFolder } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';

const messages = contactMessagesMessages;

interface MessagesSearchProps {
	folder: ContactFolder;
	search: string;
}

/** Searches on the server — a GET form, so the query lives in the URL. */
export function MessagesSearch({ folder, search }: MessagesSearchProps) {
	return (
		<Form
			action={messagesPath}
			className="flex gap-2 sm:w-[28rem]"
		>
			{folder === ContactFolder.INBOX ? null : (
				<input
					type="hidden"
					name="folder"
					value={folder}
				/>
			)}
			<div className="relative flex-1">
				<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					name="search"
					defaultValue={search}
					placeholder={messages.searchPlaceholder}
					aria-label={messages.searchPlaceholder}
					className="pl-9"
				/>
			</div>
			<Button
				type="submit"
				variant="secondary"
			>
				{messages.search}
			</Button>
			{search ? (
				<Button
					asChild
					variant="ghost"
				>
					<Link href={inboxHref({ folder })}>
						{messages.clearSearch}
					</Link>
				</Button>
			) : null}
		</Form>
	);
}
