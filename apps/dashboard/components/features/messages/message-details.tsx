import { Mail } from 'lucide-react';
import { Fragment } from 'react';

import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	contactMessageMessages,
	contactScopeLabels,
	contactStartLabels
} from '@/constants/contact-messages';
import { relativeTime } from '@/utils/relative-time';
import type { ContactMessageRecord } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

const messages = contactMessageMessages;

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
	dateStyle: 'medium',
	timeStyle: 'short'
});

/** Who wrote, about what, and the message itself — with a reply link. */
export function MessageDetails({ message }: { message: ContactMessageRecord }) {
	const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(messages.replySubject)}`;

	const rows = [
		{ term: messages.fields.email, value: message.email },
		{
			term: messages.fields.company,
			value: message.company ?? messages.noCompany
		},
		{
			term: messages.fields.project,
			value: contactScopeLabels[message.scope]
		},
		{
			term: messages.fields.start,
			value: contactStartLabels[message.start]
		},
		{
			term: messages.fields.received,
			value: dateTimeFormat.format(new Date(message.createdAt))
		},
		...(message.sourcePath
			? [{ term: messages.fields.source, value: message.sourcePath }]
			: []),
		...(message.readAt && message.readBy
			? [
					{
						term: messages.fields.readBy,
						value: messages.readBy(
							message.readBy.name,
							relativeTime(message.readAt)
						)
					}
				]
			: [])
	];

	return (
		<>
			<SectionCard title={messages.message}>
				<p className="leading-relaxed break-words whitespace-pre-wrap">
					{message.message}
				</p>
				<Button
					asChild
					className="self-start"
				>
					<a href={replyHref}>
						<Mail />
						{messages.reply}
					</a>
				</Button>
			</SectionCard>
			<dl className="grid gap-x-6 gap-y-3 rounded-lg border p-5 text-sm sm:grid-cols-[max-content_1fr]">
				{rows.map((row) => (
					<Fragment key={row.term}>
						<dt className="text-muted-foreground">{row.term}</dt>
						<dd className="break-words">{row.value}</dd>
					</Fragment>
				))}
			</dl>
		</>
	);
}
