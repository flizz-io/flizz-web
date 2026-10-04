'use client';

import { createContext, useContext, useMemo, useRef } from 'react';

export interface ContactPrefill {
	name: string;
	email: string;
}

interface ContactPrefillContextValue {
	/** Read at the moment it's needed — writing never re-renders anything. */
	getPrefill: () => ContactPrefill;
	setPrefill: (prefill: Partial<ContactPrefill>) => void;
}

const emptyPrefill: ContactPrefill = { name: '', email: '' };

const ContactPrefillContext = createContext<ContactPrefillContextValue>({
	getPrefill: () => emptyPrefill,
	setPrefill: () => {}
});

/**
 * Hands what the visitor typed into the contact form to the booking embed
 * below it, so a visitor who switches to booking a call doesn't type their
 * name and email twice. Held in a ref: every keystroke updates it, and the
 * embed reads it once, when it loads.
 */
export function ContactPrefillProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const prefillRef = useRef<ContactPrefill>(emptyPrefill);

	const value = useMemo<ContactPrefillContextValue>(
		() => ({
			getPrefill: () => prefillRef.current,
			setPrefill: (prefill) => {
				prefillRef.current = { ...prefillRef.current, ...prefill };
			}
		}),
		[]
	);

	return (
		<ContactPrefillContext.Provider value={value}>
			{children}
		</ContactPrefillContext.Provider>
	);
}

export function useContactPrefill() {
	return useContext(ContactPrefillContext);
}
