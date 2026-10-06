/**
 * Falls back to localhost so a developer without the variable set still gets
 * absolute URLs that resolve, rather than metadata silently pointing at a
 * guessed production domain.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3300';

export const siteConfig = {
	/**
	 * The one brand name for search, share cards and structured data (decided
	 * 2026-10-06, SEO2), so search engines and AI models see one company.
	 */
	name: 'Flizz',
	url: siteUrl,
	/**
	 * The spoken form of flizz.io, shown as the wordmark in the footer. Never
	 * used in metadata; JSON-LD lists it as the `alternateName`.
	 */
	fullname: 'Flizzio',
	shortName: 'FZ',
	/** Open Graph locale — British English, matching the copy. */
	locale: 'en_GB',
	tagline: "Your Technology Partner for What's Next",
	description:
		'We build transparent, maintainable systems that give you freedom to pivot, scale, or switch vendors without starting over.',
	contactEmail: 'hello@flizz.io'
} as const;
