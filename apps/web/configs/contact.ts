/**
 * The contact page's outside services, each off while its variable is unset
 * (docs/requirements/contact-page.md#environment-variables). Inlined at build
 * time — restart dev or redeploy after changing one.
 */
export const contactIntegrations = {
	/** The API's origin — the browser posts the form straight to it. */
	apiUrl: process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '',
	/** Cloudflare Turnstile — unset, the form sends no CAPTCHA token. */
	turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '',
	/** Calendly event link — unset, the booking slot says to email instead. */
	calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ?? ''
} as const;
