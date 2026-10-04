import { consentCookie } from '@/constants/consent';
import { ConsentChoice } from '@/enums/consent';

const listeners = new Set<() => void>();

/** The stored choice, or `null` when the visitor hasn't chosen yet. */
export function readConsent(): ConsentChoice | null {
	const entry = document.cookie
		.split('; ')
		.find((part) => part.startsWith(`${consentCookie.name}=`));
	const value = entry?.slice(consentCookie.name.length + 1);

	return (
		Object.values(ConsentChoice).find((choice) => choice === value) ?? null
	);
}

/** Stores the choice and tells every reader (`useSyncExternalStore`). */
export function writeConsent(choice: ConsentChoice) {
	const secure = window.location.protocol === 'https:' ? '; Secure' : '';
	document.cookie = `${consentCookie.name}=${choice}; Max-Age=${consentCookie.maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
	listeners.forEach((listener) => listener());
}

export function subscribeToConsent(listener: () => void) {
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
}
