import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False while server-rendering and hydrating, true after. For output that
 * depends on the browser — e.g. the viewer's time zone — so the server and
 * the first client render agree.
 */
export function useIsClient() {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false
	);
}
