import { siteConfig } from '@/configs/site';
import type { LegalDocument, LegalLink, LegalProcessor } from '@/types/legal';

/**
 * Who stands behind the site. Both documents read from this, so registering
 * the business is a one-place change.
 *
 * TODO: the partnership is not registered yet. Once it is, set `legalName`,
 * `registration` and `address`, and confirm `jurisdiction` — the terms are
 * governed by it and the privacy policy names it as the data controller.
 */
export const legalEntity = {
	tradingName: siteConfig.name,
	legalName: null as string | null,
	registration: null as string | null,
	address: null as string | null,
	jurisdiction: 'Bangladesh'
};

export const legalPaths = {
	privacy: '/privacy-policy',
	terms: '/terms-and-conditions'
} as const;

const contactLink: LegalLink = {
	text: siteConfig.contactEmail,
	href: `mailto:${siteConfig.contactEmail}`
};

const entityName = legalEntity.legalName ?? legalEntity.tradingName;

/**
 * Every service that handles visitor data for us. Keep this list true to what
 * the site actually loads — it is the part of the policy most likely to go
 * stale. Links checked 2026-10-03.
 *
 * TODO: Calendly, Turnstile, Google Analytics and the Meta Pixel are listed
 * ahead of launch (tasks CM2, CM8, L2). Drop any that don't ship. Add the
 * email provider once L8 picks one.
 */
export const legalProcessors: LegalProcessor[] = [
	{
		name: 'Vercel',
		purpose: 'Hosts the website and its API',
		data: 'Request data (IP address, browser, pages requested) in short-lived server logs',
		location: 'United States, served from a global network',
		policyUrl: 'https://vercel.com/legal/privacy-policy'
	},
	{
		name: 'Neon',
		purpose: 'Stores the messages sent through the contact form',
		data: 'Everything you enter in the contact form',
		location: 'United States',
		policyUrl: 'https://neon.com/privacy-policy'
	},
	{
		name: 'Cloudinary',
		purpose: 'Stores and delivers the images on the site',
		data: 'Request data when your browser loads an image',
		location: 'United States',
		policyUrl: 'https://cloudinary.com/privacy'
	},
	{
		name: 'Crisp',
		purpose: 'Runs the live chat',
		data: 'Chat messages, the email address if you give one, browser and device details',
		location: 'European Union',
		policyUrl: 'https://crisp.chat/en/privacy/'
	},
	{
		name: 'Calendly',
		purpose: 'Books discovery calls',
		data: 'Name, email, the time you choose and anything you add to the booking',
		location: 'United States',
		policyUrl: 'https://calendly.com/privacy'
	},
	{
		name: 'Cloudflare Turnstile',
		purpose: 'Tells people from bots when the contact form is sent',
		data: 'Browser and device signals; no tracking across other sites',
		location: 'Global network',
		policyUrl: 'https://www.cloudflare.com/privacypolicy/'
	},
	{
		name: 'Google Analytics',
		purpose:
			'Measures which pages are visited and how people find the site',
		data: 'Pages viewed, approximate location, device and browser, a cookie identifier',
		location: 'United States',
		policyUrl: 'https://policies.google.com/privacy',
		consentRequired: true
	},
	{
		name: 'Meta Pixel',
		purpose:
			'Measures whether our adverts on Facebook and Instagram lead to enquiries',
		data: 'Pages viewed, actions such as sending the form, a cookie identifier',
		location: 'United States',
		policyUrl: 'https://www.facebook.com/privacy/policy/',
		consentRequired: true
	}
];

export const privacyPolicy: LegalDocument = {
	title: 'Privacy policy',
	lead: 'What we collect when you visit, write to us or book a call, why we need it, who else handles it, and how to have it changed or deleted.',
	updatedAt: '2026-10-03',
	summary: [
		{
			term: 'What we collect',
			value: 'What you choose to send us, and basic data about how the site is used.'
		},
		{
			term: 'Why',
			value: 'To reply to you, run the calls you book, and keep the site working and secure.'
		},
		{
			term: 'Selling it',
			value: 'Never. We don’t sell or rent personal data to anyone.'
		},
		{
			term: 'Tracking cookies',
			value: 'Only if you accept them. Turning them down changes nothing else.'
		},
		{
			term: 'Your say',
			value: 'Ask to see, correct or delete what we hold at any time.'
		}
	],
	sections: [
		{
			id: 'who-we-are',
			title: 'Who we are',
			blocks: [
				{
					type: 'paragraph',
					text: `${entityName} (“we”, “us”) is a software studio. We decide how the personal data described here is used, which makes us its controller under data protection law.`
				},
				...(legalEntity.address
					? [
							{
								type: 'paragraph' as const,
								text: `Registered ${legalEntity.registration ? `as ${legalEntity.registration}, ` : ''}at ${legalEntity.address}.`
							}
						]
					: []),
				{
					type: 'paragraph',
					text: [
						'This policy covers visitors to this website, people who contact us, and people who book a call with us. Questions about it go to ',
						contactLink,
						'.'
					]
				}
			]
		},
		{
			id: 'what-we-collect',
			title: 'What we collect',
			blocks: [
				{ type: 'subheading', text: 'When you send the contact form' },
				{
					type: 'paragraph',
					text: 'Your name, email address, company (optional), the kind of project, when you want to start, and your message. We also record when it was sent, which page it was sent from, and a scrambled (hashed) form of your IP address that can’t be turned back into the address — it lets us spot repeated spam.'
				},
				{ type: 'subheading', text: 'When you use the chat' },
				{
					type: 'paragraph',
					text: 'Your messages, your email address if you give it, and details about your browser and device that the chat service collects to run the conversation.'
				},
				{ type: 'subheading', text: 'When you book a call' },
				{
					type: 'paragraph',
					text: 'Your name, email address, the time you pick and anything you write in the booking form. Calendly collects this and shares it with us.'
				},
				{ type: 'subheading', text: 'When you browse' },
				{
					type: 'paragraph',
					text: 'Our hosting provider logs technical details of each request, such as IP address, browser and the page asked for. If you accept analytics and advertising cookies, Google Analytics and the Meta Pixel also record which pages you visit and what you do on them.'
				},
				{
					type: 'paragraph',
					text: 'We don’t ask for sensitive information (health, religion, politics and the like). Please don’t include it in a message.'
				}
			]
		},
		{
			id: 'how-we-use-it',
			title: 'How we use it, and on what basis',
			blocks: [
				{
					type: 'paragraph',
					text: 'Data protection law asks us to name a legal basis for each use. Ours are:'
				},
				{
					type: 'list',
					items: [
						'Replying to your enquiry, running the calls you book and preparing a proposal — because you asked us to, as a step before a possible contract, and in our legitimate interest in answering the people who write to us.',
						'Keeping the site and forms secure and free of spam — our legitimate interest in protecting the service and the people who use it.',
						'Measuring visits and advert performance with analytics and advertising cookies — only with your consent, which you can withdraw at any time.',
						'Keeping records the law requires, for example if you become a client — our legal obligations.'
					]
				},
				{
					type: 'paragraph',
					text: 'We don’t make decisions about you by automated means alone, and we don’t add you to a mailing list because you wrote to us.'
				}
			]
		},
		{
			id: 'cookies',
			title: 'Cookies and similar storage',
			blocks: [
				{
					type: 'paragraph',
					text: 'Some storage is needed for the site to work and is always on:'
				},
				{
					type: 'list',
					items: [
						'Your light or dark theme choice, kept in your browser’s local storage.',
						'Whether you have seen the opening animation this visit, kept in session storage and cleared when you close the tab.',
						'Your cookie choice itself, so we don’t ask again on every page.',
						'The chat service’s cookies, which keep a conversation open while you move between pages.'
					]
				},
				{
					type: 'paragraph',
					text: 'Analytics and advertising cookies (Google Analytics and the Meta Pixel) are off until you accept them in the cookie banner. You can change your choice at any time from the “Cookie settings” link at the bottom of every page.'
				}
			]
		},
		{
			id: 'who-we-share-it-with',
			title: 'Who we share it with',
			blocks: [
				{
					type: 'paragraph',
					text: 'We use the services below to run the site. Each handles data only to provide its service to us, under its own terms and privacy policy. Services marked “with consent” load only if you accept the matching cookies.'
				},
				{ type: 'processors' },
				{
					type: 'paragraph',
					text: 'Inside the team, only the people who handle enquiries can read what you send. We share data outside these services only when the law requires it, or to protect our rights in a dispute.'
				}
			]
		},
		{
			id: 'international-transfers',
			title: 'Where your data goes',
			blocks: [
				{
					type: 'paragraph',
					text: 'Several of these services store data in the United States, and our team may read it from wherever they work. When data leaves the UK or the European Economic Area, we rely on the safeguards these providers offer for that, such as the European Commission’s Standard Contractual Clauses, the UK’s equivalent addendum, or the EU–US Data Privacy Framework.'
				}
			]
		},
		{
			id: 'how-long-we-keep-it',
			title: 'How long we keep it',
			blocks: [
				{
					type: 'list',
					items: [
						'Contact form messages and call bookings: 24 months after our last exchange, then deleted. If you become a client, for as long as we work together and as long afterwards as accounting and legal duties require.',
						'Chat conversations: 12 months.',
						'Analytics data: 14 months, the shortest period Google Analytics offers.',
						'Hosting logs: a few days to a few weeks, as set by the hosting provider.'
					]
				},
				{
					type: 'paragraph',
					text: 'You can ask us to delete your data sooner — see section 9.'
				}
			]
		},
		{
			id: 'security',
			title: 'How we protect it',
			blocks: [
				{
					type: 'paragraph',
					text: 'Data travels over encrypted connections and is stored with providers that encrypt it at rest. Our admin dashboard is limited to named team members who sign in with their Google account, and each person sees only the areas they need. No system is perfectly secure; if a breach put your data at risk, we would tell you and the relevant regulator as the law requires.'
				}
			]
		},
		{
			id: 'your-rights',
			title: 'Your rights',
			blocks: [
				{
					type: 'paragraph',
					text: 'Wherever you are, you can ask us to:'
				},
				{
					type: 'list',
					items: [
						'tell you what we hold about you and send you a copy;',
						'correct anything that is wrong;',
						'delete it;',
						'stop or limit how we use it, or object to a use based on our legitimate interests;',
						'send it to you, or another organisation, in a common format.'
					]
				},
				{
					type: 'paragraph',
					text: [
						'Where we rely on your consent, you can withdraw it at any time. Write to ',
						contactLink,
						' from the address you used with us, and we will reply within one month. There is no charge.'
					]
				},
				{
					type: 'paragraph',
					text: [
						'If you are unhappy with how we have handled your data, please tell us first so we can put it right. You can also complain to a data protection regulator — in the UK, the ',
						{
							text: 'Information Commissioner’s Office',
							href: 'https://ico.org.uk/make-a-complaint/'
						},
						'; in the EU, the authority in your country.'
					]
				}
			]
		},
		{
			id: 'children',
			title: 'Children',
			blocks: [
				{
					type: 'paragraph',
					text: 'The site is for businesses and isn’t aimed at anyone under 16. We don’t knowingly collect data from children; if you think we have, tell us and we will delete it.'
				}
			]
		},
		{
			id: 'changes',
			title: 'Changes to this policy',
			blocks: [
				{
					type: 'paragraph',
					text: 'When we change how we handle data — a new service, a new use — we update this page and the date at the top. If a change affects data we already hold, we will tell the people affected before it applies.'
				}
			]
		},
		{
			id: 'contact',
			title: 'Contact',
			blocks: [
				{
					type: 'paragraph',
					text: [
						'For anything about your data, write to ',
						contactLink,
						'. We read every message, and an actual person replies.'
					]
				}
			]
		}
	]
};

export const termsAndConditions: LegalDocument = {
	title: 'Terms and conditions',
	lead: 'The rules for using this website. Work we do for clients runs on a separate written agreement, never on this page.',
	updatedAt: '2026-10-03',
	summary: [
		{
			term: 'Using the site',
			value: 'Free to browse and to share links. Don’t misuse the site or its forms.'
		},
		{
			term: 'Our content',
			value: 'The writing, design and code on the site are ours. Ask before reusing them.'
		},
		{
			term: 'Promises',
			value: 'Nothing here is an offer. Prices, timelines and scope are agreed in writing.'
		},
		{
			term: 'Calls and proposals',
			value: 'Free and without obligation, on either side.'
		}
	],
	sections: [
		{
			id: 'about-these-terms',
			title: 'About these terms',
			blocks: [
				{
					type: 'paragraph',
					text: `This website is run by ${entityName} (“we”, “us”). By using it you accept these terms. If you don’t accept them, please don’t use the site.`
				},
				{
					type: 'paragraph',
					text: [
						'How we handle personal data is covered separately, in our ',
						{ text: 'privacy policy', href: legalPaths.privacy },
						'.'
					]
				}
			]
		},
		{
			id: 'using-the-site',
			title: 'Using the site',
			blocks: [
				{
					type: 'paragraph',
					text: 'You may browse the site, link to it and share its pages. You must not:'
				},
				{
					type: 'list',
					items: [
						'try to break into, overload or disrupt the site, its forms or the systems behind them;',
						'send spam, malicious code or automated submissions through the contact form or chat;',
						'copy the site’s content in bulk, by scraping or otherwise, to republish it or train a product on it, without our written permission;',
						'pretend to be someone else when you contact us.'
					]
				},
				{
					type: 'paragraph',
					text: 'We may block access from anyone who does.'
				}
			]
		},
		{
			id: 'our-content',
			title: 'Our content',
			blocks: [
				{
					type: 'paragraph',
					text: `The text, articles, design, graphics and code of this site belong to ${entityName} or the people who licensed them to us. Quoting a short passage with a link back is fine. Anything more — republishing an article, reusing the design — needs our written permission.`
				},
				{
					type: 'paragraph',
					text: 'Client names, logos and trademarks shown on the site belong to their owners and appear with their permission or as a factual reference to work we did.'
				}
			]
		},
		{
			id: 'not-an-offer',
			title: 'What the site is, and isn’t',
			blocks: [
				{
					type: 'paragraph',
					text: 'The services, timelines, project results and examples on the site describe how we usually work and what we have done before. They are not an offer, a quote or a guarantee of what a future project will cost, take or achieve.'
				},
				{
					type: 'paragraph',
					text: 'Every engagement is agreed in a separate written contract that sets out its scope, price, timeline and terms. If that contract and this page ever disagree, the contract applies.'
				}
			]
		},
		{
			id: 'calls-and-proposals',
			title: 'Calls, proposals and what you share',
			blocks: [
				{
					type: 'paragraph',
					text: 'Discovery calls and the proposals that follow them are free. Neither side is committed to anything until a contract is signed.'
				},
				{
					type: 'paragraph',
					text: 'Please don’t send confidential information through the contact form or chat. If you need to share it before we talk, ask for a non-disclosure agreement and we will sign one first. We treat what you tell us in a call as confidential either way.'
				}
			]
		},
		{
			id: 'other-services',
			title: 'Links and services run by others',
			blocks: [
				{
					type: 'paragraph',
					text: 'The site links to other websites and uses services run by other companies, such as the booking calendar and the chat. We don’t control them, and their own terms apply when you use them.'
				}
			]
		},
		{
			id: 'availability',
			title: 'Availability and accuracy',
			blocks: [
				{
					type: 'paragraph',
					text: 'We work to keep the site available and correct, but we can’t promise it will always be online, error-free or up to date. We may change or remove any part of it without notice.'
				}
			]
		},
		{
			id: 'liability',
			title: 'Our liability',
			blocks: [
				{
					type: 'paragraph',
					text: 'The site and its content are provided as they are, for general information. As far as the law allows, we are not liable for any loss that comes from using the site or relying on its content — including lost profits, lost data or business interruption.'
				},
				{
					type: 'paragraph',
					text: 'Nothing in these terms limits liability that the law does not allow to be limited, such as liability for fraud, or for death or personal injury caused by negligence.'
				}
			]
		},
		{
			id: 'changes',
			title: 'Changes to these terms',
			blocks: [
				{
					type: 'paragraph',
					text: 'We may update these terms. The date at the top shows when they last changed, and the version on this page is the one that applies.'
				}
			]
		},
		{
			id: 'governing-law',
			title: 'Governing law',
			blocks: [
				{
					type: 'paragraph',
					text: `These terms are governed by the laws of ${legalEntity.jurisdiction}, and its courts settle any dispute about them. If you live elsewhere, you keep any protection that the law where you live gives you and that can’t be signed away.`
				}
			]
		},
		{
			id: 'contact',
			title: 'Contact',
			blocks: [
				{
					type: 'paragraph',
					text: [
						'Questions about these terms go to ',
						contactLink,
						'.'
					]
				}
			]
		}
	]
};
