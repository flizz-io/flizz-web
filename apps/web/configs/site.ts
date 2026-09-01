/**
 * Falls back to localhost so a developer without the variable set still gets
 * absolute URLs that resolve, rather than metadata silently pointing at a
 * guessed production domain.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3300';

export const siteConfig = {
	name: 'Flizz',
	url: siteUrl,
	fullname: 'Flizzio',
	shortName: 'FZ',
	tagline: "Your Technology Partner for What's Next",
	description:
		'We build transparent, maintainable systems that give you freedom to pivot, scale, or switch vendors without starting over.',
	contactEmail: 'hello@flizz.io'
} as const;
