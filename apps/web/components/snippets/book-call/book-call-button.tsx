'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';

import { bookCallFallbackHref } from '@/constants/booking';
import { useBooking } from '@/contexts/booking-context';
import { useContactPrefill } from '@/contexts/contact-prefill-context';
import { CtaType } from '@/enums/analytics';
import { Button } from '@workspace/ui/components/button';

type BookCallButtonProps = Omit<
	ComponentProps<typeof Button>,
	'asChild' | 'onClick'
> & {
	/** Runs just before the popup opens — e.g. to close a menu. */
	onOpen?: () => void;
};

/**
 * Opens the Calendly popup. Still a real link to the contact page, which is
 * where it goes without JavaScript, before Calendly is configured, or on a
 * modified click (new tab).
 */
export function BookCallButton({
	children,
	onOpen,
	...props
}: BookCallButtonProps) {
	const { enabled, openBooking } = useBooking();
	const { getPrefill } = useContactPrefill();

	const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
		const modified =
			event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
		if (!enabled || modified || event.button !== 0) return;

		event.preventDefault();
		onOpen?.();
		openBooking(getPrefill());
	};

	return (
		<Button
			asChild
			{...props}
		>
			<Link
				href={bookCallFallbackHref}
				onClick={onClick}
				data-cta={CtaType.BOOK_CALL}
			>
				{children}
			</Link>
		</Button>
	);
}
