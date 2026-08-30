import type { ProjectScope, ProjectStart } from '@/enums/contact';

export interface ContactFormValues {
	name: string;
	company: string;
	email: string;
	/** Empty until picked — the form starts with nothing chosen for them. */
	scope: ProjectScope | '';
	start: ProjectStart | '';
	message: string;
}

export type ContactFieldErrors = Partial<
	Record<keyof ContactFormValues, string>
>;

/**
 * One choice, worded twice. The labelled forms need a category name; the
 * written brief needs a phrase that finishes the sentence around it. Same
 * option either way, so the value submitted never depends on the variation.
 */
export interface ContactChoice<TValue extends string> {
	value: TValue;
	label: string;
	phrase: string;
}

export type ProjectScopeChoice = ContactChoice<ProjectScope>;
export type ProjectStartChoice = ContactChoice<ProjectStart>;

/** A row in the hero's readout — what you get, stated before you ask for it. */
export interface ContactCommitment {
	term: string;
	value: string;
}

export interface ContactChannel {
	label: string;
	/** The address itself, set in the utility face. */
	value: string;
	href: string;
	description: string;
}

/** What every form variation is handed by the switcher. */
export interface ContactFormVariationProps {
	sectionIndex: number;
	totalSections?: number;
}

export interface ContactNextStep {
	title: string;
	description: string;
	/** How long this step takes, set beside the title. */
	duration: string;
}
