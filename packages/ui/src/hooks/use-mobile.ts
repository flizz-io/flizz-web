import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onChange: () => void) {
	const query = window.matchMedia(MOBILE_QUERY);
	query.addEventListener('change', onChange);

	return () => query.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;
// The server has no viewport; assume desktop until the client says otherwise.
const getServerSnapshot = () => false;

/** Below Tailwind's `md` — where the sidebar becomes a sheet. */
export function useIsMobile() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
