'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	useSyncExternalStore
} from 'react';

import { ConsentChoice } from '@/enums/consent';
import { readConsent, subscribeToConsent, writeConsent } from '@/utils/consent';

interface ConsentContextValue {
	/** `null` until the visitor chooses (or while the cookie is being read). */
	choice: ConsentChoice | null;
	/** The cookie has been read — before that, render nothing either way. */
	ready: boolean;
	/** The banner is open again from "Cookie settings". */
	settingsOpen: boolean;
	choose: (choice: ConsentChoice) => void;
	openSettings: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
	choice: null,
	ready: false,
	settingsOpen: false,
	choose: () => {},
	openSettings: () => {}
});

/**
 * The visitor's cookie choice, shared by the banner, the footer's "Cookie
 * settings" link and anything that may only load after consent (analytics —
 * wrap it in `<WithConsent>`).
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
	// The cookie only exists in the browser: the server (and hydration) see
	// `undefined` — not read yet — so both render the same thing.
	const stored = useSyncExternalStore<ConsentChoice | null | undefined>(
		subscribeToConsent,
		readConsent,
		() => undefined
	);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const choice = stored ?? null;
	const ready = stored !== undefined;

	const choose = useCallback((next: ConsentChoice) => {
		writeConsent(next);
		setSettingsOpen(false);
	}, []);

	const openSettings = useCallback(() => setSettingsOpen(true), []);

	const value = useMemo(
		() => ({ choice, ready, settingsOpen, choose, openSettings }),
		[choice, ready, settingsOpen, choose, openSettings]
	);

	return (
		<ConsentContext.Provider value={value}>
			{children}
		</ConsentContext.Provider>
	);
}

export function useConsent() {
	return useContext(ConsentContext);
}
