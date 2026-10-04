/** An inline link inside legal copy — an email, a regulator, a provider. */
export interface LegalLink {
	text: string;
	href: string;
}

/** Plain copy, or copy with links in it, in reading order. */
export type LegalText = string | (string | LegalLink)[];

/**
 * One unit of a legal section. `processors` renders the shared list of
 * services that handle visitor data, so the privacy policy and anything else
 * that names them read from one source.
 */
export type LegalBlock =
	| { type: 'paragraph'; text: LegalText }
	| { type: 'subheading'; text: string }
	| { type: 'list'; items: LegalText[] }
	| { type: 'processors' };

export interface LegalSection {
	/** Anchor id, so a section can be linked to and cross-referenced. */
	id: string;
	title: string;
	blocks: LegalBlock[];
}

/** One row of the plain-language summary at the top of the page. */
export interface LegalSummaryItem {
	term: string;
	value: string;
}

export interface LegalDocument {
	title: string;
	/** One or two lines under the title; also the meta description. */
	lead: string;
	/** ISO date. Changes whenever the substance of the document changes. */
	updatedAt: string;
	summary: LegalSummaryItem[];
	sections: LegalSection[];
}

/** A service that handles visitor data on our behalf. */
export interface LegalProcessor {
	name: string;
	purpose: string;
	data: string;
	location: string;
	/** The provider's own privacy policy. */
	policyUrl: string;
	/** Loads only after the visitor accepts the matching cookies. */
	consentRequired?: boolean;
}
