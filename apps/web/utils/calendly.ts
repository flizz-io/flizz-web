import {
	calendlyDefaultUtm,
	calendlyThemeColors,
	calendlyUtmParams
} from '@/constants/contact';
import type { ContactPrefill } from '@/contexts/contact-prefill-context';

interface CalendlyUrlOptions {
	prefill: ContactPrefill;
	dark: boolean;
	/** The page's own query string — its UTM tags are passed on. */
	pageSearch: string;
	/** The site's host, which Calendly asks inline embeds to name. */
	embedDomain: string;
}

/**
 * The inline-embed URL for a Calendly event link: prefilled name and email,
 * the site's colours, its own cookie notice hidden (the site has one), and
 * campaign tags — the visitor's own, or `calendlyDefaultUtm`.
 */
export function buildCalendlyUrl(
	eventUrl: string,
	{ prefill, dark, pageSearch, embedDomain }: CalendlyUrlOptions
) {
	const url = new URL(eventUrl);
	const colors = dark ? calendlyThemeColors.dark : calendlyThemeColors.light;
	const page = new URLSearchParams(pageSearch);

	url.searchParams.set('embed_domain', embedDomain);
	url.searchParams.set('embed_type', 'Inline');
	url.searchParams.set('hide_gdpr_banner', '1');
	url.searchParams.set('background_color', colors.background);
	url.searchParams.set('text_color', colors.text);
	url.searchParams.set('primary_color', colors.primary);

	if (prefill.name.trim()) url.searchParams.set('name', prefill.name.trim());
	if (prefill.email.trim())
		url.searchParams.set('email', prefill.email.trim());

	const tagged = calendlyUtmParams.some((key) => page.get(key));
	for (const key of calendlyUtmParams) {
		const value = tagged
			? page.get(key)
			: calendlyDefaultUtm[key as keyof typeof calendlyDefaultUtm];
		if (value) url.searchParams.set(key, value);
	}

	return url.toString();
}
