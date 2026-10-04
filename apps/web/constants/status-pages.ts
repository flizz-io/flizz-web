/** Where a lost visitor most likely meant to go — the 404's way out. */
export const statusPageLinks = [
	{ label: 'Services', href: '/services' },
	{ label: 'Work', href: '/portfolio' },
	{ label: 'Articles', href: '/articles' },
	{ label: 'Contact', href: '/contact' }
] as const;

export const notFoundCopy = {
	metaTitle: 'Page not found',
	code: '404',
	title: 'This page isn’t here',
	lead: 'The link may be old, or the page may have moved. These are the places people usually look for:',
	home: 'Back to the home page'
} as const;

export const errorCopy = {
	code: '500',
	title: 'Something broke on our side',
	lead: 'It isn’t anything you did. Try again — if it keeps happening, email us and we’ll look into it.',
	retry: 'Try again',
	home: 'Back to the home page'
} as const;
