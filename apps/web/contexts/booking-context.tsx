'use client';

import dynamic from 'next/dynamic';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState
} from 'react';

import { contactIntegrations } from '@/configs/contact';
import type { ContactPrefill } from '@/contexts/contact-prefill-context';

// Only fetched the first time someone asks to book.
const BookCallDialog = dynamic(
	() =>
		import('@/components/snippets/book-call/book-call-dialog').then(
			(mod) => mod.BookCallDialog
		),
	{ ssr: false }
);

interface BookingContextValue {
	/** `false` until `NEXT_PUBLIC_CALENDLY_URL` is set — buttons then link. */
	enabled: boolean;
	openBooking: (prefill: ContactPrefill) => void;
}

const BookingContext = createContext<BookingContextValue>({
	enabled: false,
	openBooking: () => {}
});

const emptyPrefill: ContactPrefill = { name: '', email: '' };

/**
 * One Calendly popup for the whole site. Any `BookCallButton` opens it; the
 * dialog renders outside the smoothed content (Radix portals it to `body`),
 * so it stays fixed to the screen.
 */
export function BookingProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [prefill, setPrefill] = useState<ContactPrefill>(emptyPrefill);

	const openBooking = useCallback((next: ContactPrefill) => {
		setPrefill(next);
		setMounted(true);
		setOpen(true);
	}, []);

	const value = useMemo<BookingContextValue>(
		() => ({
			enabled: Boolean(contactIntegrations.calendlyUrl),
			openBooking
		}),
		[openBooking]
	);

	return (
		<BookingContext.Provider value={value}>
			{children}
			{mounted ? (
				<BookCallDialog
					open={open}
					onOpenChange={setOpen}
					prefill={prefill}
				/>
			) : null}
		</BookingContext.Provider>
	);
}

export function useBooking() {
	return useContext(BookingContext);
}
