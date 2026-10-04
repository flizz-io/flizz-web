/**
 * The part of Cloudflare Turnstile's browser API the contact form uses —
 * https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 */
interface TurnstileRenderOptions {
	sitekey: string;
	execution?: 'render' | 'execute';
	appearance?: 'always' | 'execute' | 'interaction-only';
	action?: string;
	callback?: (token: string) => void;
	'error-callback'?: (code: string) => void;
	'expired-callback'?: () => void;
}

interface TurnstileApi {
	render: (
		container: HTMLElement,
		options: TurnstileRenderOptions
	) => string | undefined;
	execute: (widgetId: string) => void;
	reset: (widgetId: string) => void;
	remove: (widgetId: string) => void;
}

interface Window {
	turnstile?: TurnstileApi;
}
