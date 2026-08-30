import type { FooterLinkGroup, SocialLink } from '@/types/nav';

export const footerLinkGroups: FooterLinkGroup[] = [
	{
		title: 'Company',
		items: [
			{ label: 'About', href: '/about' },
			{ label: 'Contact', href: '/contact' }
		]
	},
	{
		title: 'Explore',
		items: [
			{ label: 'Services', href: '/services' },
			{ label: 'Portfolio', href: '/portfolio' },
			{ label: 'Articles', href: '/articles' }
		]
	},
	{
		title: 'Legal',
		items: [
			{ label: 'Terms & Conditions', href: '/terms-and-conditions' },
			{ label: 'Privacy Policy', href: '/privacy-policy' }
		]
	}
];

export const socialLinks: SocialLink[] = [
	{ label: 'LinkedIn', href: 'https://linkedin.com' },
	{ label: 'Twitter', href: 'https://twitter.com' },
	{ label: 'GitHub', href: 'https://github.com' }
];
