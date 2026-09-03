import { ArticleByline, ArticleCategory } from '@/enums/articles';
import type { Article } from '@/types/articles';
import type {
	ArticleComment,
	ArticleEngagement,
	ArticleEngagementOptions
} from '@/types/engagement';

/**
 * Which attribution the article pages render. Both `AUTHOR` and `COMPANY` are
 * built — change this one value to compare them.
 *
 * TODO: PM to choose. Bylines currently point at the placeholder About roster.
 */
export const articleByline = ArticleByline.AUTHOR;

export const articlesHeroLead =
	'Notes on building software that has to keep working — what we argue about, what we got wrong, and the decisions that turned out to matter.';

export const articlesCtaHeading = 'Rather talk than read?';
export const articlesCtaLead =
	'Everything here comes out of real projects. If one of these sounds like your situation, a discovery call is faster than another article.';

/**
 * TODO: PM to replace. All six are placeholder, written to the site's voice
 * rather than published work.
 *
 * `author` must match a `name` in `aboutTeam` exactly. It is matched by string,
 * so a roster rename silently drops the byline back to the company form rather
 * than erroring — check both files together when either changes.
 */
export const articles: Article[] = [
	{
		slug: 'your-api-is-a-support-queue',
		title: 'Your API is a support queue',
		excerpt:
			'Every undocumented endpoint becomes someone else’s guess, and every guess eventually becomes your ticket.',
		category: ArticleCategory.ENGINEERING,
		tags: ['APIs', 'Documentation', 'Versioning', 'Developer experience'],
		publishedAt: '2026-08-18',
		author: 'Zahid Showarav',
		body: [
			{
				type: 'paragraph',
				text: 'An API without documentation is not an integration surface. It is a support queue with extra steps, and the bill arrives monthly in the form of questions your engineers answer instead of building.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'The cost shows up somewhere else'
			},
			{
				type: 'paragraph',
				text: 'Teams skip the contract because it feels like overhead next to shipping the endpoint. The endpoint takes a week. The eighteen months of answering "what does this field mean" takes considerably longer, and it lands on the people least able to absorb it.'
			},
			{
				type: 'list',
				items: [
					'Consumers guess at field meanings, then encode the guess',
					'Every change breaks somebody who was never told',
					'The owning team becomes the bottleneck for everyone else',
					'Nobody can deprecate anything, because nobody knows who depends on it'
				]
			},
			{
				type: 'heading',
				level: 2,
				text: 'Design the contract first'
			},
			{
				type: 'paragraph',
				text: 'Agreeing the shape before writing the handler costs an afternoon and settles the arguments while they are still cheap. It also means the documentation is generated from the thing that actually runs, so it cannot drift.'
			},
			{
				type: 'code',
				language: 'ts',
				code: 'type ListInvoices = {\n\t/** ISO-8601. Inclusive. */\n\tsince: string;\n\t/** Defaults to 50, capped at 200. */\n\tlimit?: number;\n\tstatus?: "draft" | "open" | "paid" | "void";\n};'
			},
			{
				type: 'paragraph',
				text: 'Three lines of comment answer the questions that would otherwise arrive one at a time, from different people, over two years.'
			},
			{
				type: 'quote',
				text: 'Versioning is not a feature you add later. It is the promise that lets anyone depend on you at all.',
				attribution: 'Every team that has broken a partner integration'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Versioning is a promise, not a suffix'
			},
			{
				type: 'paragraph',
				text: 'Putting /v1/ in the path is not versioning. Versioning is the commitment that a consumer who integrated last March still works today, and the stated process by which that will eventually stop being true. Without the second half you do not have a version, you have a number.'
			},
			{
				type: 'paragraph',
				text: 'The practical form is unglamorous: additive changes ship freely, breaking changes get a new version, and old versions get a deprecation window measured in months with a date attached. Publish the date. A deprecation without a date is a rumour, and consumers correctly ignore rumours.'
			},
			{
				type: 'image',
				alt: 'A request flowing through version negotiation to a handler, with the deprecation window shown alongside.',
				caption:
					'The deprecation window is a property of the contract, not a note in a changelog.',
				aspect: '16/9'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Know who depends on you'
			},
			{
				type: 'paragraph',
				text: 'You cannot honour a deprecation window if you do not know who is inside it. Authenticated requests should carry enough identity to answer "who is still calling this endpoint, and when did they last do it" without a code change. That single capability turns deprecation from a gamble into a conversation.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Who owns the documentation'
			},
			{
				type: 'paragraph',
				text: 'Documentation maintained separately from the code is documentation that is wrong within two sprints. Nobody is lying; the endpoint simply changed on a Tuesday and the page did not. The only durable arrangement is generation from the same source the server runs.'
			},
			{
				type: 'paragraph',
				text: 'That still leaves the part a generator cannot produce: why the endpoint exists, what it is for, and which of the three similar-looking ones a caller actually wants. Two sentences of prose per resource does more for adoption than an exhaustive schema, and it is the part worth a human writing.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'What good looks like'
			},
			{
				type: 'paragraph',
				text: 'A partner integrates without booking a call. A breaking change is something you decided to do rather than something you discovered. And the team that owns the API spends its week building rather than answering. None of that requires more engineering than the alternative — it requires the design conversation to happen a week earlier.'
			}
		]
	},
	{
		slug: 'the-rewrite-you-do-not-need',
		title: 'The rewrite you don’t need',
		excerpt:
			'Full rewrites are the most reliable way to lose two years. There is almost always a staged path, and it is almost always faster.',
		category: ArticleCategory.ENGINEERING,
		tags: ['Legacy systems', 'Migration', 'Risk'],
		publishedAt: '2026-07-29',
		author: 'Abdur Rahman',
		body: [
			{
				type: 'paragraph',
				text: 'The pitch is always the same. The current system is a mess, nobody wants to touch it, and a clean rebuild will take six months. It takes two years, and the thing it replaces kept shipping the whole time.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'What the old system actually knows'
			},
			{
				type: 'paragraph',
				text: 'A decade-old system encodes a decade of decisions nobody wrote down — the tax edge case, the customer who is invoiced differently, the retry that exists because a partner goes down every Tuesday. A rewrite discards all of it and rediscovers it in production.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Replace the riskiest piece first'
			},
			{
				type: 'list',
				ordered: true,
				items: [
					'Map what the system does, not what it was meant to do',
					'Pick the component that would hurt most if it failed tomorrow',
					'Run the replacement alongside, with traffic shifted gradually',
					'Only remove the original once the new path has earned it'
				]
			},
			{
				type: 'paragraph',
				text: 'Every step ships. Every step is reversible. No single migration can take the business offline, which is the property a rewrite can never offer.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Run both, briefly'
			},
			{
				type: 'paragraph',
				text: 'The uncomfortable middle of a staged migration is the period where two systems do the same job. It feels wasteful, and it is the thing that makes the migration safe: real traffic proves the replacement while the original is still one configuration change away.'
			},
			{
				type: 'paragraph',
				text: 'Shadow the writes before you move them. Send production traffic to the new path, compare the result against the old one, and log every disagreement without acting on it. The disagreements are the specification nobody wrote down — and finding them this way costs a dashboard rather than an incident.'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Pick the seam, not the module'
			},
			{
				type: 'paragraph',
				text: 'The unit of replacement is rarely the unit the code is organised into. Look for a boundary where the data flow is narrow enough to intercept — a queue, an endpoint, a scheduled job. A narrow seam can be swapped in a fortnight. A wide one turns into the rewrite you were avoiding.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'When a rewrite is genuinely right'
			},
			{
				type: 'paragraph',
				text: 'Sometimes it is. When the platform underneath is unsupported and unpatchable, when the language runtime has no security updates, or when the system is small enough that a rebuild is measured in weeks — the staged path costs more than it saves. The test is not how bad the code feels. It is whether the thing can be replaced in pieces at all.'
			},
			{
				type: 'quote',
				text: 'Every rewrite is a bet that you understand the old system. Most teams discover in month nine that they did not.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'The documentation dividend'
			},
			{
				type: 'paragraph',
				text: 'Mapping a legacy system in order to replace it produces something the organisation has usually never had: an accurate account of what it does. That artefact outlives the migration. Even the parts you decide not to replace become cheaper to work on, because somebody finally wrote down what they were for.'
			}
		]
	},
	{
		slug: 'when-a-smaller-model-is-the-answer',
		title: 'When a smaller model is the answer',
		excerpt:
			'Most AI features do not need the largest model. They need a defined task, an evaluation, and a fallback.',
		category: ArticleCategory.AI,
		tags: ['LLMs', 'Evaluation', 'Cost control', 'Retrieval'],
		publishedAt: '2026-07-11',
		author: 'Mehjabin Islam',
		body: [
			{
				type: 'paragraph',
				text: 'The demo works because someone typed a good prompt while watching. Production is different: nobody is watching, the inputs are stranger than anyone imagined, and the model is confidently wrong at three in the morning.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Define correct before choosing anything'
			},
			{
				type: 'paragraph',
				text: 'Almost every failed AI project skipped this. If you cannot say what a correct output looks like, you cannot evaluate a model, which means you cannot choose one — you can only prefer one.'
			},
			{
				type: 'quote',
				text: 'A task you can grade is a task you can automate. A task you cannot grade is a demo.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Then the cheap option often wins'
			},
			{
				type: 'paragraph',
				text: 'Once the task is narrow and graded, a smaller model frequently clears the bar at a fraction of the cost and latency. That is not a compromise. It is the result of having asked the question properly.'
			},
			{
				type: 'list',
				items: [
					'A success bar you can measure against real examples',
					'A fallback for when the model is unsure',
					'A cost ceiling that cannot be breached silently',
					'Regression checks, so an upgrade cannot quietly get worse'
				]
			},
			{
				type: 'heading',
				level: 2,
				text: 'Build the evaluation before the feature'
			},
			{
				type: 'paragraph',
				text: 'Collect fifty real examples with the answers you would accept. Not synthetic ones — real inputs, including the ugly ones people actually submit. That set is the most valuable artefact of the whole project, and it takes an afternoon to assemble.'
			},
			{
				type: 'paragraph',
				text: "With it, every subsequent question becomes answerable. Is the cheaper model good enough? Run it. Did the prompt change help or hurt? Run it. Did last night's provider update quietly degrade you? Run it. Without it, all of those are matters of opinion, and the loudest opinion wins."
			},
			{
				type: 'heading',
				level: 3,
				text: 'Where retrieval earns its place'
			},
			{
				type: 'paragraph',
				text: 'Most business tasks fail not because the model is too small but because it has never seen your data. Retrieval over your own documents fixes more problems than a larger model does, and it has the additional property of being auditable: you can show which source produced an answer, which matters enormously once someone disputes one.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'The cost is not the sticker price'
			},
			{
				type: 'paragraph',
				text: 'Per-token pricing is the easy part to forecast. The costs that surprise teams are retries on malformed output, the long tail of inputs that blow past the context window, and the engineer who now spends a day a week tuning prompts. A smaller, narrower model reduces all three at once.'
			},
			{
				type: 'paragraph',
				text: 'Latency deserves the same scrutiny. A feature that takes eleven seconds is a feature people route around, however correct it is. Frequently the honest answer is to do less with the model and more with ordinary code around it.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Decide what happens when it is wrong'
			},
			{
				type: 'paragraph',
				text: 'It will be wrong. The question is only whether that is contained. Low confidence should route to a person, not to a confident guess. Every automated decision should be reconstructable afterwards. And a hard ceiling on spend should exist before launch rather than after the first surprising invoice.'
			}
		]
	},
	{
		slug: 'we-argue-features-out-of-scope',
		title: 'We argue features out of scope',
		excerpt:
			'The most valuable thing an engineering partner does is say no to the feature you were ready to pay for.',
		category: ArticleCategory.PRODUCT,
		tags: ['Scope', 'Discovery', 'Prioritisation'],
		publishedAt: '2026-06-24',
		author: 'Meer Estiyak',
		body: [
			{
				type: 'paragraph',
				text: 'Agencies are paid by the hour, which makes talking a client out of work a strange business decision. It is also the one that keeps clients, because a smaller build that works beats a larger one that arrives late.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Every feature has a second bill'
			},
			{
				type: 'paragraph',
				text: 'The build is the first cost. The second is permanent: it has to be tested, documented, supported, migrated, and explained to every new hire for as long as it exists. Features are not bought once.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'The question that settles it'
			},
			{
				type: 'paragraph',
				text: 'What changes for the business if this does not exist? If the answer takes more than a sentence, it is not ready to be built yet — and finding that out now costs a conversation rather than a quarter.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'How the conversation actually goes'
			},
			{
				type: 'paragraph',
				text: 'It is not a refusal. It is a question, asked early enough that answering it is cheap: what changes for the business if this does not exist? Sometimes the answer is immediate and specific, and the feature gets built. More often the room goes quiet, and that silence has just saved a month.'
			},
			{
				type: 'paragraph',
				text: 'The useful follow-up is what would have to be true for this to matter. It converts a preference into a testable claim, and quite often into something far smaller than the original request — a report instead of a dashboard, a setting instead of a workflow.'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Half a feature is worse than none'
			},
			{
				type: 'paragraph',
				text: 'The compromise nobody should accept is building a feature partially to satisfy everyone. It carries the full maintenance cost, delivers a fraction of the value, and becomes impossible to remove because someone, somewhere, has started depending on the fragment.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'What happens when nobody says no'
			},
			{
				type: 'paragraph',
				text: 'Scope grows quietly, because each individual addition is reasonable. The launch slips a fortnight at a time, the codebase acquires paths nobody exercises, and onboarding a new engineer takes a week longer every year. No single decision caused it, which is exactly why no single decision reverses it.'
			},
			{
				type: 'quote',
				text: 'The cheapest feature is the one you talked yourself out of. The most expensive is the one nobody uses but everybody maintains.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'It costs us money'
			},
			{
				type: 'paragraph',
				text: 'Arguing work out of scope reduces the invoice, which is a strange thing for an agency to optimise for. It is also the reason clients come back, and the reason the projects we do build tend to ship. We would rather be the firm that said no twice than the one that quietly billed for both.'
			}
		]
	},
	{
		slug: 'multi-tenant-from-day-one',
		title: 'Multi-tenant from day one, or never',
		excerpt:
			'Retrofitting tenant isolation into a single-tenant product is not a refactor. It is a rewrite with a deadline.',
		category: ArticleCategory.ENGINEERING,
		tags: ['SaaS', 'Architecture', 'Data isolation'],
		publishedAt: '2026-06-02',
		author: 'Rifat Ahmed',
		body: [
			{
				type: 'paragraph',
				text: 'The first customer does not need multi-tenancy. Neither does the second. By the time the tenth arrives it is load-bearing, and by then every query in the system assumes there is only one of everything.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Where it leaks'
			},
			{
				type: 'list',
				items: [
					'A report that quietly includes another customer’s rows',
					'Billing that cannot handle a mid-month plan change',
					'Permissions that assume one flat team, not a real org chart',
					'An admin tool that can only be operated by an engineer'
				]
			},
			{
				type: 'paragraph',
				text: 'None of these are bugs exactly. They are the shape of the original decision, surfacing late.'
			},
			{
				type: 'code',
				language: 'sql',
				code: '-- Every table, every query, from the first migration.\nselect *\nfrom invoices\nwhere tenant_id = $1\n  and status = $2;'
			},
			{
				type: 'paragraph',
				text: 'Adding that column on day one costs nothing. Adding it in year two means auditing every query in the codebase and being certain you found them all.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'What the retrofit actually involves'
			},
			{
				type: 'paragraph',
				text: 'Adding tenancy late is not a migration you can review in an afternoon. Every query has to be audited, every background job has to learn whose data it is operating on, every cache key has to be scoped, and every report has to be re-verified. The work is not conceptually hard. It is unbounded, which is worse.'
			},
			{
				type: 'paragraph',
				text: "The dangerous part is that nothing fails loudly. A missing tenant filter does not throw — it returns more rows than it should, and the bug is discovered by a customer reading someone else's data in an export."
			},
			{
				type: 'heading',
				level: 3,
				text: 'Make the safe path the default'
			},
			{
				type: 'paragraph',
				text: 'Relying on every developer to remember the filter is relying on perfect memory forever. Push it down a layer: a scoped repository, a row-level policy, a base query nothing bypasses. The goal is that writing the unsafe version requires deliberate effort rather than a moment of inattention.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Already single-tenant?'
			},
			{
				type: 'paragraph',
				text: 'Then do it in the order that reduces risk fastest. Introduce the tenant column everywhere before enforcing it anywhere. Backfill. Add the enforcement at the lowest layer you control. Then remove the ad-hoc filters above it, one at a time, with tests that prove isolation rather than merely asserting the happy path.'
			},
			{
				type: 'paragraph',
				text: "Write the test that tries to read another tenant's row and expects failure. It is the only test that matters here, and it should exist for every table that holds customer data."
			},
			{
				type: 'heading',
				level: 2,
				text: 'The economics, restated'
			},
			{
				type: 'paragraph',
				text: 'Multi-tenancy is not about elegance. It is the difference between the tenth customer costing less to serve than the first and costing the same. That ratio is the entire business model of a SaaS company, and it is decided by choices made long before anyone is watching it.'
			}
		]
	},
	{
		slug: 'what-a-two-week-cadence-costs',
		title: 'What a two-week cadence actually costs',
		excerpt:
			'Shipping working software every two weeks is not free. It is worth it, and the price should be stated plainly.',
		category: ArticleCategory.PRACTICE,
		tags: ['Delivery', 'Process', 'Client work'],
		publishedAt: '2026-05-14',
		author: 'Imran Hossain',
		body: [
			{
				type: 'paragraph',
				text: 'Every agency promises regular delivery. Fewer are honest that a two-week cadence has real overhead — and that the overhead is the point, not a side effect.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'What you give up'
			},
			{
				type: 'paragraph',
				text: 'Some work does not divide neatly into fortnights. Holding to the cadence means occasionally shipping a smaller slice than the engineer wanted, and building a seam that would not otherwise exist.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'What you get back'
			},
			{
				type: 'list',
				items: [
					'Wrong directions are caught in weeks, not quarters',
					'Nobody has to trust a status report over working software',
					'Scope conversations happen against something real',
					'The project can stop at any point and still have shipped'
				]
			},
			{
				type: 'quote',
				text: 'The cadence is not a reporting rhythm. It is the mechanism that makes being wrong survivable.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'What breaks it'
			},
			{
				type: 'paragraph',
				text: 'Cadence fails in predictable ways. A piece of work is accepted that cannot be halved. A review takes nine days because the person who has to give it is travelling. Or a demo becomes a performance — polished, rehearsed, and no longer a look at the real state of things.'
			},
			{
				type: 'paragraph',
				text: 'The third is the most damaging, because it is the one that feels like professionalism. A demo is useful precisely to the degree that it is unflattering. If a fortnight went badly, the demo should show that, and the conversation it triggers is the entire value of the arrangement.'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Someone has to be able to decide'
			},
			{
				type: 'paragraph',
				text: 'A two-week rhythm requires decisions on a matching rhythm. If feedback needs three stakeholders to align and they meet monthly, the cadence is decorative — work is shipped into a queue and nobody responds until it is too late to act on cheaply. Agree who can decide before the first sprint, not during the third.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Working software, specifically'
			},
			{
				type: 'paragraph',
				text: 'Working software means something a person can open and use, not a branch that compiles. The distinction matters because only the first kind can be wrong in an informative way. A branch tells you the code exists. A running feature tells you whether it was worth building.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'The property that matters most'
			},
			{
				type: 'paragraph',
				text: 'A project run this way can stop at almost any point and still have delivered something. Budgets get cut and priorities move; when that happens, the difference between having shipped nine increments and having a half-finished branch is the difference between a change of plan and a write-off.'
			}
		]
	}
];

/**
 * Which engagement affordances the article pages render. Each is designed but
 * not yet wired — nothing below persists, reacts, or counts anything.
 *
 * TODO: connect to the Articles API at Stage 10, then remove the static
 * figures in `articleEngagement` and the sample thread in `articleComments`.
 */
export const articleEngagementOptions: ArticleEngagementOptions = {
	views: true,
	reactions: true,
	share: true,
	comments: true
};

/** TODO: placeholder figures. Replace with real counts from the API. */
export const articleEngagement: ArticleEngagement = {
	views: 2847,
	reactions: 63,
	commentCount: 3
};

/** TODO: placeholder thread, shown so the design can be judged before the API. */
export const articleComments: ArticleComment[] = [
	{
		id: 'c1',
		author: 'Priya Raman',
		role: 'Engineering lead, Northwind',
		postedAt: '2026-08-20',
		body: 'The deprecation-window point lands. We published a date for the first time last quarter and it changed the conversation with partners completely — it stopped being a threat and started being a plan.',
		replies: [
			{
				id: 'c1r1',
				author: 'Zahid Showarav',
				role: 'Co-founder, Principal Engineer',
				postedAt: '2026-08-20',
				body: 'That matches what we see. The date is the whole thing — without one, everybody assumes they are the exception.'
			}
		]
	},
	{
		id: 'c2',
		author: 'Tom Ashworth',
		postedAt: '2026-08-19',
		body: 'Curious how you handle the case where a consumer never migrates and the deprecation date arrives. Do you actually switch it off?'
	}
];
