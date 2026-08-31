import type {
	AboutFigure,
	AboutValue,
	Guarantee,
	Milestone,
	OperatingPrinciple,
	TeamMember
} from '@/types/about';

export const aboutHeroHeading = 'Accelerate growth,';
export const aboutHeroHeadingAccent = 'not complexity';

export const aboutHeroLead =
	'We started by building our own products. The services came after — which is why we think like a product team that happens to be for hire, not an agency looking for the next brief.';

/**
 * TODO: PM to replace with real figures. Only the founding year is confirmed.
 * `Projects shipped` must stay in step with the `stats` band in
 * `constants/home.ts` — the two pages publish the same number.
 */
export const aboutFigures: AboutFigure[] = [
	{ value: '2024', label: 'Founded, in March' },
	{ value: '20', suffix: '+', label: 'Projects shipped' },
	{ value: '7', label: 'People, four of them founders' },
	{ value: '18', label: 'Clients served' }
];

export const aboutMission =
	'To solve the technology problems that hold businesses back.';

export const aboutMissionSupport =
	'Most software that fails a business does not fail technically. It fails because nobody asked what it was for. We start there, and we keep asking until the answer holds up.';

export const aboutOriginLead =
	'Flizz began in March 2024 with two engineers and a handful of product ideas of our own. Building those taught us the thing most agencies never have to learn: what it costs to live with a decision for two years. Two more co-founders joined, companies started asking who built our tools, and the services practice grew out of the answer.';

export const aboutOriginNote =
	'We still build our own products. It is the reason we argue with briefs instead of just invoicing them.';

/**
 * TODO: PM to correct every date after March 2024 — the founding month and the
 * four-co-founder arc are confirmed; the rest are placeholders.
 */
export const aboutMilestones: Milestone[] = [
	{
		date: 'Mar 2024',
		title: 'Two engineers, one workshop',
		description:
			'Founded to build our own product ideas, funded by the consulting work that paid for the time to build them.'
	},
	{
		date: 'Sep 2024',
		title: 'The founding four',
		description:
			'Two more co-founders joined, bringing product and design in-house and completing the team the company still runs on.'
	},
	{
		date: 'Feb 2025',
		title: 'First client engagement',
		description:
			'A company that had seen our internal tooling asked for the same thing. The services practice starts here.'
	},
	{
		date: 'Jul 2025',
		title: 'Seven people',
		description:
			'Engineering, design, and QA became distinct disciplines rather than hats the founders swapped between.'
	},
	{
		date: 'Mar 2026',
		title: 'AI integration becomes a practice',
		description:
			'Retrieval, automation, and the unglamorous work of deciding when a smaller model is the right answer.'
	},
	{
		date: 'Aug 2026',
		title: '20+ projects shipped',
		description:
			'Every one of them handed over with documentation, and every one still owned by the client.'
	}
];

/**
 * Stated as decision rules rather than benefits — the home page already lists
 * the outcomes, and repeating them here would give a returning visitor nothing.
 * Wording approved by the PM on 2026-08-31.
 */
export const aboutValues: AboutValue[] = [
	{
		title: 'We argue features out of scope',
		description:
			'The "no" is what protects the budget. Every feature has to justify itself by revenue, cost, or competitive position — and the ones that cannot, do not get built, however much fun they would be.',
		impact: 'Technology spending with measurable returns'
	},
	{
		title: 'We design for 10x the work, not 10x the headcount',
		description:
			'Architecture gets judged against unit economics, not elegance. If handling ten times the volume means hiring ten times the people, we built the wrong thing.',
		impact: 'Profitable scaling, not just growth'
	},
	{
		title: 'We build what cannot be bought',
		description:
			'Where an off-the-shelf tool would do the job, we say so and lose the line item. Custom is reserved for the capabilities that turn into a moat.',
		impact: 'Defensible advantages in your market'
	},
	{
		title: 'We ship in weeks and decide in hours',
		description:
			'Cadence is a commitment, not an aspiration. Working software every two weeks, and decisions that take an afternoon rather than a steering committee.',
		impact: 'Capture opportunities before competitors do'
	},
	{
		title: 'We push back',
		description:
			'We challenge the brief rather than execute it quietly. It is the least comfortable part of the engagement and the part that most often ends up costing you less than what was originally asked for.',
		impact: 'Better solutions, often below the original budget'
	}
];

export const aboutOperatingPrinciples: OperatingPrinciple[] = [
	{
		term: 'Weekly',
		description:
			'Check-ins with working software every two weeks. Progress you can open, not progress you are told about.'
	},
	{
		term: 'No black box',
		description:
			'You see the repository, the board, and the reasoning. Nothing about the build is ours to withhold.'
	},
	{
		term: 'Full handover',
		description:
			'Documentation, team training, and optional support — delivered whether or not you keep us on afterwards.'
	},
	{
		term: 'Not dependent',
		description:
			'The handover is designed so you could leave. That is the point of it, and the reason most clients do not.'
	}
];

export const aboutGuarantees: Guarantee[] = [
	{ term: 'Warranty', value: '30–90 days on everything we ship' },
	{ term: 'Code & IP', value: 'Yours from day one' },
	{ term: 'Progress', value: 'Working software every two weeks' },
	{ term: 'Pricing', value: 'Fixed proposal after a free discovery call' },
	{
		term: 'Handover',
		value: 'Documentation and training, so you could leave'
	}
];

/**
 * Controls section 6. The roster below is placeholder content, so the section
 * can be switched off in one place if the page goes live before the real team
 * is confirmed.
 */
export const showTeamSection = true;

/**
 * TODO: PM to replace with the real team. Names, roles, and profile URLs are
 * demo content, and `photo` is deliberately unset on every row — each frame
 * shows an initials plate until a real photograph is dropped in.
 */
export const aboutTeam: TeamMember[] = [
	{
		name: 'Zahid Showarav',
		role: 'Co-founder, Principal Engineer',
		isFounder: true,
		photo: '/team-members/zahid.png',
		links: {
			linkedin: 'https://www.linkedin.com/in/arman-chowdhury',
			x: 'https://x.com/armanchowdhury',
			portfolio: 'https://armanchowdhury.dev'
		}
	},
	{
		name: 'Abdur Rahman',
		role: 'Co-founder, CTO',
		isFounder: true,
		photo: '/team-members/riyad.png',
		links: {
			linkedin: 'https://www.linkedin.com/in/nabila-rahman',
			x: 'https://x.com/nabilarahman',
			portfolio: 'https://nabilarahman.dev'
		}
	},
	{
		name: 'Meer Estiyak',
		role: 'Co-founder, Product',
		photo: '/team-members/meer.jpg',
		isFounder: true,
		links: {
			linkedin: 'https://www.linkedin.com/in/tanvir-hasan',
			x: 'https://x.com/tanvirhasan'
		}
	},
	{
		name: 'Imran Hossain Estiyak',
		role: 'Co-founder, Product',
		photo: '/team-members/imran-hossain.jpeg',
		isFounder: true,
		links: {
			linkedin: 'https://www.linkedin.com/in/tanvir-hasan',
			x: 'https://x.com/tanvirhasan'
		}
	},
	{
		name: 'Rifat Ahmed',
		role: 'Senior Full-stack Engineer',
		links: {
			linkedin: 'https://www.linkedin.com/in/rifat-ahmed',
			x: 'https://x.com/rifatahmed'
		}
	},
	{
		name: 'Mehjabin Islam',
		role: 'AI/ML Engineer',
		links: {
			linkedin: 'https://www.linkedin.com/in/mehjabin-islam',
			portfolio: 'https://mehjabin.ai'
		}
	},
	{
		name: 'Zayan Kabir',
		role: 'QA & Release Engineer',
		links: {
			linkedin: 'https://www.linkedin.com/in/zayan-kabir'
		}
	}
];

export const aboutCtaHeading = 'Now tell us what you are building';
export const aboutCtaLead =
	'You have read how we work. The next step is a free discovery call — no deck, no sales script, and no obligation past the hour.';
