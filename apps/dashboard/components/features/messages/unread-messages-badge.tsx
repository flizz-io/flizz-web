'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
	contactMessagesChangedEvent,
	contactMessagesMessages
} from '@/constants/contact-messages';
import { getContactMessageSummaryService } from '@workspace/api-services';
import { SidebarMenuBadge } from '@workspace/ui/components/sidebar';

/**
 * The sidebar's unread count for Messages. Refetched on every navigation and
 * whenever a screen announces a change, so reading a message clears it.
 * Nothing shows at zero, or if the count can't be fetched.
 */
export function UnreadMessagesBadge() {
	const pathname = usePathname();
	const [unread, setUnread] = useState(0);
	const [version, setVersion] = useState(0);

	useEffect(() => {
		let cancelled = false;

		getContactMessageSummaryService()
			.then((summary) => {
				if (!cancelled) setUnread(summary.unread);
			})
			.catch(() => {
				if (!cancelled) setUnread(0);
			});

		return () => {
			cancelled = true;
		};
	}, [pathname, version]);

	useEffect(() => {
		const bump = () => setVersion((current) => current + 1);
		window.addEventListener(contactMessagesChangedEvent, bump);

		return () =>
			window.removeEventListener(contactMessagesChangedEvent, bump);
	}, []);

	if (unread === 0) return null;

	return (
		<SidebarMenuBadge
			aria-label={contactMessagesMessages.unreadCount(unread)}
			className="bg-primary text-primary-foreground peer-hover/menu-button:text-primary-foreground peer-data-active/menu-button:text-primary-foreground"
		>
			{unread}
		</SidebarMenuBadge>
	);
}
