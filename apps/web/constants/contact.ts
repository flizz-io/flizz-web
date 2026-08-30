import { ProjectScope, ProjectStart } from '@/enums/contact';
import type {
	ContactChannel,
	ContactCommitment,
	ContactNextStep,
	ProjectScopeChoice,
	ProjectStartChoice
} from '@/types/contact';
// The FAQ row shape is the same one the home page uses — reused rather than
// redeclared, so the two lists stay renderable by the same treatment.
import type { FaqItem } from '@/types/home';

/** Anchors the hero's hand-off to the form. */
export const contactFormAnchorId = 'start';

// What the page promises, stated before anything is asked for. Every line here
// is already made elsewhere on the site (see `riskReversals` and `faqItems`) —
// TODO: PM to confirm the NDA line before launch.
export const contactCommitments: ContactCommitment[] = [
	{ term: 'Reply', value: 'Within 1 business day' },
	{ term: 'Call', value: '30 minutes, no charge' },
	{ term: 'Proposal', value: 'Fixed scope, fixed price' },
	{ term: 'NDA', value: 'On request, before you share' }
];

export const projectScopeChoices: ProjectScopeChoice[] = [
	{
		value: ProjectScope.NEW_BUILD,
		label: 'Building something new',
		phrase: 'building something new'
	},
	{
		value: ProjectScope.REBUILD,
		label: 'Replacing a system',
		phrase: 'replacing a system we have outgrown'
	},
	{
		value: ProjectScope.SCALE,
		label: 'Scaling what works',
		phrase: 'scaling something that already works'
	},
	{
		value: ProjectScope.FIX,
		label: 'Fixing what is broken',
		phrase: 'fixing something that is broken'
	},
	{
		value: ProjectScope.UNDECIDED,
		label: 'Still working it out',
		phrase: 'still working out what we need'
	}
];

export const projectStartChoices: ProjectStartChoice[] = [
	{
		value: ProjectStart.IMMEDIATELY,
		label: 'As soon as you can',
		phrase: 'as soon as you have room'
	},
	{
		value: ProjectStart.THIS_QUARTER,
		label: 'This quarter',
		phrase: 'this quarter'
	},
	{
		value: ProjectStart.NEXT_QUARTER,
		label: 'Next quarter',
		phrase: 'next quarter'
	},
	{
		value: ProjectStart.EXPLORING,
		label: 'No date yet',
		phrase: 'whenever — there is no date yet'
	}
];

// A real sequence: each step only happens once the one before it has. That is
// what earns the numbering here, rather than decoration.
export const contactNextSteps: ContactNextStep[] = [
	{
		title: 'An engineer reads it',
		duration: 'Within 1 business day',
		description:
			'Not a sales rep and not an autoresponder. You get back either the questions we still need answered, or a time to talk.'
	},
	{
		title: 'We talk it through',
		duration: '30 minutes',
		description:
			'Goals, constraints, and what success actually looks like. If we are the wrong shop for it, we say so on the call and point you somewhere better.'
	},
	{
		title: 'You get it in writing',
		duration: '3 to 5 days',
		description:
			'Scope, timeline and price in plain language. Nothing to pay to see it, and nothing owed if you walk away from it.'
	}
];

export const contactChannels: ContactChannel[] = [
	{
		label: 'Email',
		value: 'hello@flizz.io',
		href: 'mailto:hello@flizz.io',
		description: 'Best for detailed briefs, documents and existing specs.'
	}
];

export const contactBookingPoints: string[] = [
	'Thirty minutes, no charge, no deck',
	'An engineer on the call, not only an account manager',
	'Come with a problem, leave with a direction'
];

// TODO: PM to confirm the scheduler, then swap the placeholder slot in
// `contact-booking.tsx` for the real embed.
export const contactBookingSlotLabel = 'Calendar — not connected yet';

export const contactFaqItems: FaqItem[] = [
	{
		question: 'What should I put in the first message?',
		answer: 'Whatever you already know: the problem, who it affects, and any date you are working to. You do not need a spec, a budget or a wireframe — those are what the first call is for. If it is easier to say out loud than to write, book the call instead.'
	},
	{
		question: 'What does it cost to talk to you?',
		answer: 'Nothing. The discovery call is free and so is the proposal that follows it. You pay once you have agreed scope, timeline and price — never to find out what those would be.'
	},
	{
		question: 'Will you sign an NDA first?',
		answer: 'Yes, before you share anything sensitive. Say so in your message and we will send one over — you do not have to describe the confidential part to get one.'
	},
	{
		question: 'What if we are not a good fit?',
		answer: 'We tell you on the call rather than in a proposal three weeks later, and we point you toward someone better suited. Taking on the wrong project costs us more than turning it down.'
	}
];
