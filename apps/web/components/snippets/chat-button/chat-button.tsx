'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';

import { crispChatboxId, crispOpenCommands } from '@/constants/chat';
import { contactFormAnchorId } from '@/constants/contact';
import { CtaType } from '@/enums/analytics';
import { sectionHref } from '@/utils/navigation';
import { Button } from '@workspace/ui/components/button';

type ChatButtonProps = Omit<ComponentProps<typeof Button>, 'asChild'>;

const briefHref = sectionHref('/contact', contactFormAnchorId);

/**
 * Opens the Crisp chat. Crisp may not be there — unset, blocked, or not yet
 * loaded (it waits for the page to finish) — so this is a real link to the
 * contact page's brief, and only becomes "open the chat" once Crisp is up.
 */
export function ChatButton({ children, ...props }: ChatButtonProps) {
	const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
		const crisp = window.$crisp;
		// Crisp can load its API yet never mount the chatbox (it does that
		// for visitors it takes for bots), so the chatbox itself is the test.
		const chatReady =
			typeof crisp?.is === 'function' &&
			Boolean(document.getElementById(crispChatboxId));
		const modified =
			event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
		if (!crisp || !chatReady || modified || event.button !== 0) return;

		event.preventDefault();
		crispOpenCommands.forEach((command) => crisp.push(command));
	};

	return (
		<Button
			asChild
			{...props}
		>
			<Link
				href={briefHref}
				onClick={onClick}
				data-cta={CtaType.START_CHAT}
			>
				{children}
			</Link>
		</Button>
	);
}
