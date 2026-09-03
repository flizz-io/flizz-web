import { ProjectSector } from '@/enums/portfolio';
import { ServiceCategory } from '@/enums/services';
import type { ProjectDetail } from '@/types/portfolio';
import type { ServiceVisualKind } from '@workspace/service-visuals';

export const portfolioHeroLead =
	'Ten builds, five sectors, and the change each one actually made. Every project below states where it started and where it landed — including the ones that took longer than we said they would.';

export const portfolioCtaHeading = 'Recognise your own situation?';
export const portfolioCtaLead =
	'Most of this work started with someone describing a process they had outgrown. A discovery call is the fastest way to find out whether yours is the same shape.';

/**
 * The canonical roster. The index renders all of it, the home strip renders a
 * subset, and the Projects CRUD replaces it at Stage 13 — so this is the single
 * source of truth for what Flizz has shipped until then.
 *
 * TODO: PM to replace. All ten are placeholder, written to the site’s voice
 * rather than taken from real engagements — the figures in `results` in
 * particular are illustrative and must not be published as claims. Client names
 * mirror `socialProofLogos` in `constants/home.ts`; change both together.
 */
export const projects: ProjectDetail[] = [
	{
		slug: 'northwind-ops-platform',
		featured: true,
		name: 'Northwind Ops Platform',
		client: 'A 40-person operations team running a national parts network',
		sector: ProjectSector.OPERATIONS,
		service: ServiceCategory.CUSTOM_SOFTWARE,
		serviceSlug: 'saas-application-development',
		year: '2025',
		summary:
			'Replaced five spreadsheets with one system of record for a 40-person ops team.',
		results: [
			{
				label: 'Time to quote a job',
				from: 'Two days',
				to: 'Under an hour'
			},
			{
				label: 'Systems of record',
				from: 'Five spreadsheets',
				to: 'One'
			},
			{
				label: 'Month-end close',
				from: 'Four days of reconciliation',
				to: 'The same afternoon'
			}
		],
		duration: 'Five months',
		team: 'Two engineers, one designer',
		brief: [
			'Northwind ran its entire parts operation out of five spreadsheets, each owned by a different person and none of them agreeing. Quoting a job meant asking three colleagues what they had in front of them, and month-end was four days of reconciling numbers nobody trusted.',
			'They had already bought an off-the-shelf ERP and abandoned the rollout twice. The problem was never the software — it was that their process had grown around the spreadsheets, and no product on the market matched it.'
		],
		constraints: [
			'The old spreadsheets had to keep working until the last team moved across',
			'No downtime during trading hours — the network runs six days a week',
			'Ops staff had to be able to correct their own data without raising a ticket'
		],
		approach: [
			'We started with the quoting workflow rather than the data model. It was the step costing the most time, it touched every other part of the process, and getting it right told us what the underlying records actually needed to hold.',
			'From there we moved one function across per fortnight — pricing, stock, dispatch, invoicing — with the spreadsheets left in place as a read-only fallback until the team stopped opening them of their own accord.'
		],
		built: [
			'A single system of record for parts, pricing and stock',
			'Quoting that prices a job from live stock in one pass',
			'Dispatch and invoicing wired to the same records',
			'A permissions model that matches the real org chart'
		],
		stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'Redis'],
		quote: {
			text: 'The first time a quote came back in ten minutes, the room went quiet. We had assumed two days was just what it cost.',
			attribution: 'Operations Director, Northwind'
		}
	},
	{
		slug: 'marlin-co-dashboard',
		name: 'Marlin & Co Dashboard',
		client: 'A distributed logistics team working across four vendor systems',
		sector: ProjectSector.OPERATIONS,
		service: ServiceCategory.CUSTOM_SOFTWARE,
		serviceSlug: 'api-development',
		year: '2024',
		summary:
			'One dashboard in place of four vendor logins for a distributed team.',
		results: [
			{
				label: 'Logins to start a shift',
				from: 'Four',
				to: 'One'
			},
			{
				label: 'Delay before an exception is seen',
				from: 'Next morning',
				to: 'Ninety seconds'
			},
			{
				label: 'Weekly reporting effort',
				from: 'Half a day, by hand',
				to: 'Generated'
			}
		],
		duration: 'Ten weeks',
		team: 'Two engineers',
		brief: [
			'Marlin & Co coordinated shipments across four carriers, each with its own portal, its own export format and its own idea of what a delay meant. Nobody could answer "where is everything" without opening four tabs and reconciling them by eye.',
			'They did not want to replace the carriers. They wanted one place that told the truth about all four, and an alert when something slipped.'
		],
		constraints: [
			'Two of the four carriers offered no API — only a nightly CSV drop',
			'Vendor contracts were up for renewal, so nothing could be hard-wired to one carrier',
			'The team is distributed across three time zones, so alerts had to respect working hours'
		],
		approach: [
			'We normalised all four feeds into one shipment record first, before any of it reached a screen. Once every carrier described a delay the same way, the dashboard became a straightforward read over a single table.',
			'Each carrier sits behind an adapter, so replacing one at contract renewal is a day of work rather than a rebuild. That mattered more to them than any feature on the screen.'
		],
		built: [
			'A normalised shipment record fed by four carrier adapters',
			'One live board covering every shipment in flight',
			'Exception alerts routed to whoever is actually on shift',
			'Weekly reporting generated from the same records'
		],
		stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'BullMQ', 'React'],
		quote: {
			text: 'We swapped a carrier last quarter. It took an afternoon, and nobody outside the engineering team noticed.',
			attribution: 'Head of Logistics, Marlin & Co'
		}
	},
	{
		slug: 'vantage-cove-storefront',
		featured: true,
		name: 'Vantage Cove Storefront',
		client: 'A direct-to-consumer homeware brand',
		sector: ProjectSector.RETAIL,
		service: ServiceCategory.ECOMMERCE,
		serviceSlug: 'online-store-development',
		year: '2025',
		summary:
			'Rebuilt the checkout flow and cut cart abandonment by a third.',
		results: [
			{
				label: 'Cart abandonment',
				from: '74%',
				to: '49%'
			},
			{
				label: 'Checkout steps',
				from: 'Five screens',
				to: 'One'
			},
			{
				label: 'Mobile load time',
				from: '6.4s',
				to: '1.2s'
			}
		],
		duration: 'Three months',
		team: 'One engineer, one designer',
		brief: [
			'Vantage Cove had good traffic and a checkout that lost three quarters of it. Five screens, a forced account step, and a mobile experience that took six seconds to become usable on the connections most of their customers were actually on.',
			'The brand work was strong and recently done, so the rebuild had to keep the storefront looking exactly as it did and change only what happened after the basket.'
		],
		constraints: [
			'No visual redesign — the brand had just been refreshed',
			'Existing order history and customer accounts had to carry across',
			'Peak trading season was eleven weeks out and immovable'
		],
		approach: [
			'We instrumented the existing checkout before touching it, so the argument about which step was losing people was settled with data rather than opinion. Two of the five screens accounted for most of the drop.',
			'The replacement is a single-screen checkout with guest purchase first and account creation offered after payment, where it costs nothing. Everything else about the storefront stayed where it was.'
		],
		built: [
			'A one-screen checkout with guest purchase as the default path',
			'Payment, address validation and delivery options in one pass',
			'A rebuilt product page that renders in under a second on 4G',
			'Analytics wired to every step, so the next change is measurable'
		],
		stack: ['Next.js', 'Shopify Storefront API', 'Stripe', 'Vercel'],
		quote: {
			text: 'They talked us out of the redesign we asked for and fixed the thing that was actually costing us money.',
			attribution: 'Founder, Vantage Cove'
		}
	},
	{
		slug: 'halden-grove-subscriptions',
		name: 'Halden Grove Subscriptions',
		client: 'A speciality coffee roaster selling direct',
		sector: ProjectSector.RETAIL,
		service: ServiceCategory.ECOMMERCE,
		serviceSlug: 'shopify-app-development',
		year: '2026',
		summary:
			'Turned a one-off coffee business into a subscription one, without leaving Shopify.',
		results: [
			{
				label: 'Revenue from repeat customers',
				from: '18%',
				to: '46%'
			},
			{
				label: 'Handling a delivery change',
				from: 'An email to the office',
				to: 'Self-service'
			},
			{
				label: 'Failed renewals recovered',
				from: 'None — they lapsed',
				to: '61%'
			}
		],
		duration: 'Nine weeks',
		team: 'One engineer',
		brief: [
			'Halden Grove sold excellent coffee one bag at a time. Customers asked repeatedly for a standing order, and the answer was a calendar reminder and a manual invoice — which worked until roughly the fortieth subscriber.',
			'Off-the-shelf subscription apps handled the billing but not the roasting schedule, which is the part that actually constrains the business: beans are roasted to order, twice a week, in batches.'
		],
		constraints: [
			'The store stays on Shopify — the team knows it and will not be retrained',
			'Roasting happens on fixed days, so renewal dates cannot be arbitrary',
			'A customer must be able to skip, pause or change grind without emailing anyone'
		],
		approach: [
			'The subscription engine is a Shopify app rather than a separate storefront, so the checkout, the discount rules and the admin the team already knows all keep working.',
			'Renewals are aligned to the roasting calendar rather than the signup date. A subscriber picks a delivery rhythm; the app books them into the next batch that fits it, which is what makes the promise deliverable.'
		],
		built: [
			'A Shopify app handling plans, renewals and dunning',
			'Renewal scheduling aligned to the twice-weekly roast',
			'A self-service portal for skip, pause, grind and address',
			'Recovery flow for failed payments, before a subscription lapses'
		],
		stack: ['Shopify App Bridge', 'Remix', 'PostgreSQL', 'Stripe Billing'],
		quote: {
			text: 'We stopped losing subscribers to a declined card nobody noticed. That alone paid for the build.',
			attribution: 'Owner, Halden Grove'
		}
	},
	{
		slug: 'fieldstone-field-app',
		featured: true,
		name: 'Fieldstone Field App',
		client: 'An inspection business with crews working out of signal',
		sector: ProjectSector.FIELD,
		service: ServiceCategory.MOBILE,
		serviceSlug: 'native-mobile-app-development',
		year: '2024',
		summary:
			'Offline-first inspection app for crews working without signal.',
		results: [
			{
				label: 'Reports filed the same day',
				from: '38%',
				to: '94%'
			},
			{
				label: 'Re-keying site notes',
				from: 'Every report, back at the office',
				to: 'None'
			},
			{
				label: 'Inspections lost to a dead phone',
				from: 'A handful a month',
				to: 'Zero'
			}
		],
		duration: 'Four months',
		team: 'Two engineers, one designer',
		brief: [
			'Fieldstone’s inspectors work in basements, plant rooms and rural sites where there is no signal at all. Notes went onto paper, paper went into a van, and someone in the office typed it up two days later — if the sheet survived the journey.',
			'They had tried a web form. It worked in the car park and failed everywhere the actual work happens.'
		],
		constraints: [
			'Full functionality with no connectivity, for a whole working day',
			'Photographs are evidence — they cannot be compressed into uselessness',
			'Inspectors wear gloves, so every target had to survive a gloved thumb'
		],
		approach: [
			'Offline is the default state, not a degraded one. The app holds the entire job on the device, and syncing is something that happens quietly when a signal appears rather than a thing the inspector has to think about or trigger.',
			'Conflict handling was designed before the first screen: two inspectors on the same site, both offline, both editing, is a Tuesday — not an edge case.'
		],
		built: [
			'A native app that runs a full day with no connection',
			'Photo evidence captured at full resolution and queued for sync',
			'Deterministic conflict resolution when two crews overlap',
			'Report generation the inspector signs off on site'
		],
		stack: ['React Native', 'SQLite', 'TypeScript', 'Node.js', 'S3'],
		quote: {
			text: 'The crews stopped asking whether it would work in the basement about a week in. That was the whole goal.',
			attribution: 'Operations Manager, Fieldstone'
		}
	},
	{
		slug: 'ardsley-crew-scheduler',
		name: 'Ardsley Crew Scheduler',
		client: 'A utilities contractor dispatching 60 engineers a day',
		sector: ProjectSector.FIELD,
		service: ServiceCategory.MOBILE,
		serviceSlug: 'app-modernisation',
		year: '2026',
		summary:
			'Replaced a discontinued handheld with a phone app 60 engineers actually use.',
		results: [
			{
				label: 'Devices to carry',
				from: 'A handheld and a phone',
				to: 'A phone'
			},
			{
				label: 'Time to reassign an urgent job',
				from: 'A phone call per engineer',
				to: 'One dispatch, seconds'
			},
			{
				label: 'Jobs closed on site',
				from: '55%',
				to: '89%'
			}
		],
		duration: 'Five months',
		team: 'Two engineers, one designer',
		brief: [
			'Ardsley ran its dispatch on rugged handhelds the manufacturer stopped making in 2019. Spares came from eBay, the software had not been updated in six years, and the engineers all carried a phone as well because the handheld could not do anything else.',
			'The obvious move — rewrite it as a phone app — had stalled twice, because the old device also handled barcode scanning and signature capture, and nobody had confirmed a phone could replace both.'
		],
		constraints: [
			'The dispatch back office stays exactly as it is — it works, and retraining is off the table',
			'Barcode scanning has to be as fast as the dedicated hardware, or engineers will keep the handheld',
			'Rollout across depots, not all at once — both systems run in parallel for a quarter'
		],
		approach: [
			'We proved the two risky parts first, in a fortnight: camera-based scanning against the actual barcodes on the actual assets, and signature capture that the client’s auditors would accept. Everything else was known work.',
			'The app talks to the same dispatch back end the handhelds did, so a depot could switch over on a Monday and switch back on the Tuesday if it went badly. None of them did, but being able to say so is what got the rollout approved.'
		],
		built: [
			'A phone app replacing the discontinued handheld, feature for feature',
			'Camera scanning benchmarked against the old hardware',
			'Signature capture and evidence photos attached to the job record',
			'A depot-by-depot rollout that could be reversed at any point'
		],
		stack: ['React Native', 'TypeScript', 'MLKit', 'Node.js', 'PostgreSQL'],
		quote: {
			text: 'We had been quoted a full replacement of the back office as well. It turned out we only needed to replace the thing in the engineer’s hand.',
			attribution: 'Service Delivery Lead, Ardsley'
		}
	},
	{
		slug: 'rivergate-rebuild',
		name: 'Rivergate Rebuild',
		client: 'A lender running a decade-old internal platform',
		sector: ProjectSector.FINANCE,
		service: ServiceCategory.CUSTOM_SOFTWARE,
		serviceSlug: 'legacy-modernisation',
		year: '2026',
		summary:
			'Moved a decade-old internal tool off unsupported infrastructure, without downtime.',
		results: [
			{
				label: 'Platform support status',
				from: 'End of life, unpatched',
				to: 'Current and patched'
			},
			{
				label: 'Deploying a change',
				from: 'A weekend, with a rollback plan',
				to: 'Any weekday afternoon'
			},
			{
				label: 'Engineers who can safely change it',
				from: 'One',
				to: 'The whole team'
			}
		],
		duration: 'Eight months',
		team: 'Three engineers',
		brief: [
			'Rivergate’s loan administration platform had been running for eleven years on a framework that stopped receiving security patches in 2022. It worked. It also could not be upgraded, could not be hired for, and one person understood the deployment.',
			'Two consultancies had proposed a full rewrite. Both estimates were over a year, both required a freeze on new features, and the board had already declined that trade once.'
		],
		constraints: [
			'No feature freeze — the business kept shipping throughout',
			'Regulated data, so nothing moves to a new store without an audit trail',
			'Zero planned downtime; the platform is used across two time zones'
		],
		approach: [
			'Nothing was rewritten wholesale. We put a routing layer in front of the old application, then moved one bounded area at a time behind it — starting with the parts that changed most often, so the benefit arrived early rather than at the end.',
			'The old system stayed authoritative until each area had run in parallel long enough to prove itself. That is slower to describe than a rewrite and considerably faster to finish.'
		],
		built: [
			'A routing layer letting old and new run side by side',
			'Seven bounded areas migrated, highest-churn first',
			'An audit trail covering every record that moved',
			'A deployment pipeline the whole team can run'
		],
		stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Terraform'],
		quote: {
			text: 'Eleven years of assumptions, and not one of our customers noticed the migration happening. That was the brief.',
			attribution: 'CTO, Rivergate'
		}
	},
	{
		slug: 'penhurst-claims-triage',
		featured: true,
		name: 'Penhurst Claims Triage',
		client: 'A mutual insurer with a claims queue growing faster than the team',
		sector: ProjectSector.FINANCE,
		service: ServiceCategory.AI_AUTOMATION,
		serviceSlug: 'intelligent-automation',
		year: '2026',
		summary:
			'Sorted a claims backlog that was growing faster than the team could read it.',
		results: [
			{
				label: 'Time to first human review',
				from: 'Six days',
				to: 'Four hours'
			},
			{
				label: 'Claims routed to the wrong desk',
				from: 'Roughly one in five',
				to: 'One in fifty'
			},
			{
				label: 'Straightforward claims settled automatically',
				from: 'None',
				to: '31%'
			}
		],
		duration: 'Four months',
		team: 'Two engineers',
		brief: [
			'Penhurst’s claims arrived as email, post and a web form, and every one of them was read by a person before anything happened to it. The queue grew by a few hundred a week; the team did not.',
			'They were clear that they did not want a system that decided claims. They wanted one that read them, sorted them, and put the urgent ones in front of a human first.'
		],
		constraints: [
			'A person approves every settlement — no exceptions, whatever the confidence score',
			'Every automated decision has to be explainable to a regulator after the fact',
			'Claims contain medical data, so nothing leaves the insurer’s own infrastructure'
		],
		approach: [
			'The model classifies and prioritises; it never settles. That boundary was drawn on day one, and it is what made the rest of the project approvable rather than a three-month argument with compliance.',
			'Every decision writes down what it saw and why it scored the way it did, in language a claims handler can read. When the system is wrong, the handler can see exactly where it went wrong — which is also how the thresholds get tuned.'
		],
		built: [
			'Intake that reads email, post and web submissions into one queue',
			'Classification and urgency scoring, with the reasoning recorded',
			'Automatic routing to the right desk, reversible by any handler',
			'An audit view showing every decision the system made'
		],
		stack: ['Python', 'FastAPI', 'PostgreSQL', 'Claude API', 'Redis'],
		quote: {
			text: 'The point was never to remove the handlers. It was to stop them spending Monday morning deciding what to read.',
			attribution: 'Claims Director, Penhurst'
		}
	},
	{
		slug: 'adaptive-labs-intake',
		name: 'Adaptive Labs Intake',
		client: 'A research consultancy fielding enquiries by hand',
		sector: ProjectSector.PROFESSIONAL,
		service: ServiceCategory.AI_AUTOMATION,
		serviceSlug: 'ai-integration',
		year: '2026',
		summary:
			'Automated a manual intake queue that was costing two days a week.',
		results: [
			{
				label: 'Time spent on intake',
				from: 'Two days a week',
				to: 'Ninety minutes'
			},
			{
				label: 'Response to a new enquiry',
				from: 'Three to five days',
				to: 'Same day'
			},
			{
				label: 'Enquiries lost in an inbox',
				from: 'Nobody knew',
				to: 'Tracked, and none'
			}
		],
		duration: 'Seven weeks',
		team: 'One engineer',
		brief: [
			'Every enquiry to Adaptive Labs landed in a shared inbox, where a senior consultant read it, worked out which of four practice areas it belonged to, summarised it, and forwarded it on. Two days a week of a person who bills for their time.',
			'The failure mode was worse than the cost: enquiries that arrived in a busy week simply sat there, and nobody could say how many had been lost.'
		],
		constraints: [
			'A consultant still owns the reply — the system drafts, it does not send',
			'Existing shared inbox stays in place; the team will not move to a new tool',
			'Client confidentiality, so enquiry content is not retained for training'
		],
		approach: [
			'The system reads the inbox, extracts what the practice actually triages on — scope, sector, timeline, budget signal — and writes a structured summary alongside a suggested owner and a drafted reply.',
			'Nothing sends automatically. A consultant reads the summary, adjusts what needs adjusting, and presses send — which took the job from two days of reading to ninety minutes of deciding.'
		],
		built: [
			'Automated triage over the existing shared inbox',
			'Structured summaries against the four practice areas',
			'Drafted replies a consultant edits and sends',
			'A tracked queue, so nothing sits unanswered without someone knowing'
		],
		stack: ['TypeScript', 'Node.js', 'Claude API', 'PostgreSQL'],
		quote: {
			text: 'It drafts better first replies than I do at five on a Friday, and I still get to be the one who sends them.',
			attribution: 'Managing Partner, Adaptive Labs'
		}
	},
	{
		slug: 'brightmoor-client-portal',
		name: 'Brightmoor Client Portal',
		client: 'A professional services firm reporting progress by email',
		sector: ProjectSector.PROFESSIONAL,
		service: ServiceCategory.CUSTOM_SOFTWARE,
		serviceSlug: 'mvp-development',
		year: '2025',
		summary:
			'Gave clients one place to see progress, and ended the status-update email thread.',
		results: [
			{
				label: 'Status update emails per engagement',
				from: 'Around forty',
				to: 'A weekly digest'
			},
			{
				label: '“Where are we with this?” calls',
				from: 'Several a week',
				to: 'Rare'
			},
			{
				label: 'Time from delivery to client sign-off',
				from: 'Nine days',
				to: 'Two'
			}
		],
		duration: 'Eleven weeks',
		team: 'One engineer, one designer',
		brief: [
			'Brightmoor’s clients had no way to see where their work stood except by asking. Each engagement generated a long email thread, and the answer depended on which consultant replied and how recently they had checked.',
			'The firm wanted to test whether a portal would actually reduce that traffic before committing to building a full one — so the brief was explicitly a first version, sized to learn from.'
		],
		constraints: [
			'Ship in a quarter, to real clients, or the experiment proves nothing',
			'Consultants will not maintain a second source of truth — it reads from the systems they already use',
			'Clients sign in rarely, so the login has to work for someone who has forgotten they have one'
		],
		approach: [
			'We built the smallest thing that could answer the question: one engagement view, live status, deliverables, and a sign-off action. No messaging, no document management, no invoicing — all of which were asked for and all of which would have delayed the answer.',
			'It went to six clients in the tenth week. The email traffic on those engagements dropped immediately, which is what justified the second phase.'
		],
		built: [
			'One engagement view with live status and next milestone',
			'Deliverables published straight from the consultants’ own tooling',
			'Client sign-off, recorded against the deliverable',
			'A weekly digest replacing the ad hoc update email'
		],
		stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
		quote: {
			text: 'Six clients, one screen, and the thread we had been complaining about for two years just stopped.',
			attribution: 'Partner, Brightmoor'
		}
	}
];

/**
 * How the index describes its own remit, opposite the section tag. Derived so
 * the count and the span cannot drift from the roster.
 */
export const portfolioMeta = `${projects.length} projects · ${projects.reduce((earliest, project) => (project.year < earliest ? project.year : earliest), projects[0]?.year ?? '')} to ${projects.reduce((latest, project) => (project.year > latest ? project.year : latest), projects[0]?.year ?? '')}`;

/**
 * The subset the home strip carries. Named slugs rather than a slice, so the
 * teaser shows a chosen spread of sectors instead of whatever happens to sit at
 * the top of the roster.
 */
const homeTeaserSlugs = [
	'northwind-ops-platform',
	'vantage-cove-storefront',
	'fieldstone-field-app',
	'penhurst-claims-triage',
	'brightmoor-client-portal',
	'rivergate-rebuild'
];

export const homeTeaserProjects: ProjectDetail[] = homeTeaserSlugs.flatMap(
	(slug) => projects.filter((project) => project.slug === slug)
);

/**
 * What the reel plays: the work we lead with, in the roster's own order. One
 * per service category as it stands, so four frames cover the range of what we
 * do rather than four variations on one thing.
 */
export const featuredProjects: ProjectDetail[] = projects.filter(
	(project) => project.featured
);

/** Everything the reel does not carry, newest first. */
export const archiveProjects: ProjectDetail[] = projects
	.filter((project) => !project.featured)
	.sort((a, b) => b.year.localeCompare(a.year));

/** How many index rows land at a time, before and after "Load more". */
export const archivePageSize = 4;

/**
 * The scenery each chapter of the reel plays against, borrowed from the
 * specimens the services pages use.
 *
 * Per chapter rather than per project on purpose. Building one of these scenes
 * is real work on the main thread, and scrolling the whole reel would pay for
 * it ten times over — this way it happens four times, and the change of scenery
 * is what tells you the sector changed rather than another label saying so.
 */
export const projectSectorVisuals: Record<ProjectSector, ServiceVisualKind> = {
	[ProjectSector.OPERATIONS]: 'grid-lattice',
	[ProjectSector.RETAIL]: 'catalog-checkout',
	[ProjectSector.FIELD]: 'device-frame',
	[ProjectSector.FINANCE]: 'secure-rail',
	[ProjectSector.PROFESSIONAL]: 'orbit-ring'
};
