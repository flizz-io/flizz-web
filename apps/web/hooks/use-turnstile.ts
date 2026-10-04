'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { turnstileAction, turnstileScriptUrl } from '@/constants/contact';

let scriptPromise: Promise<TurnstileApi> | null = null;

/** Loads Turnstile's script once per page, however many forms ask. */
function loadTurnstile() {
	scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
		if (window.turnstile) return resolve(window.turnstile);

		const script = document.createElement('script');
		script.src = turnstileScriptUrl;
		script.async = true;
		script.onload = () =>
			window.turnstile
				? resolve(window.turnstile)
				: reject(new Error('Turnstile did not load.'));
		script.onerror = () => {
			scriptPromise = null;
			reject(new Error('Turnstile did not load.'));
		};
		document.head.appendChild(script);
	});

	return scriptPromise;
}

interface PendingToken {
	resolve: (token: string) => void;
	reject: (error: Error) => void;
}

/**
 * Cloudflare Turnstile, run on submit. The widget renders into the element
 * given to `containerRef` — a callback ref, so a form that unmounts (the
 * receipt replaces it) and comes back gets a fresh widget — but stays invisible (`interaction-only`) unless Cloudflare wants the visitor
 * to tick a box. `getToken()` resolves with a fresh single-use token — or
 * `undefined` when there's no site key, so the form works without it locally.
 */
export function useTurnstile(siteKey: string) {
	const [container, containerRef] = useState<HTMLDivElement | null>(null);
	const widgetIdRef = useRef<string | null>(null);
	const pendingRef = useRef<PendingToken | null>(null);

	useEffect(() => {
		if (!siteKey || !container) return;

		let cancelled = false;

		loadTurnstile()
			.then((turnstile) => {
				if (cancelled) return;

				widgetIdRef.current =
					turnstile.render(container, {
						sitekey: siteKey,
						action: turnstileAction,
						execution: 'execute',
						appearance: 'interaction-only',
						callback: (token) => {
							pendingRef.current?.resolve(token);
							pendingRef.current = null;
						},
						'error-callback': (code) => {
							pendingRef.current?.reject(
								new Error(`Turnstile error ${code}`)
							);
							pendingRef.current = null;
						}
					}) ?? null;
			})
			.catch(() => {
				// Left without a widget, `getToken` rejects and the form says so.
			});

		return () => {
			cancelled = true;
			if (widgetIdRef.current)
				window.turnstile?.remove(widgetIdRef.current);
			widgetIdRef.current = null;
		};
	}, [siteKey, container]);

	const getToken = useCallback(async (): Promise<string | undefined> => {
		if (!siteKey) return undefined;

		const turnstile = await loadTurnstile();
		const widgetId = widgetIdRef.current;
		if (!widgetId) throw new Error('Turnstile is not ready.');

		return new Promise<string>((resolve, reject) => {
			pendingRef.current = { resolve, reject };
			// Tokens are single-use: start over from a clean widget each time.
			turnstile.reset(widgetId);
			turnstile.execute(widgetId);
		});
	}, [siteKey]);

	return { containerRef, getToken };
}
