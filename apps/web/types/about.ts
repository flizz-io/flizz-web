/** A dated entry on the origin timeline. */
export interface Milestone {
	/** Short display date — the marker the rail is read by. */
	date: string;
	title: string;
	description: string;
}

/** A headline figure in the hero's proof strip. */
export interface AboutFigure {
	value: string;
	/** Rendered tight against the value — no space between them. */
	suffix?: string;
	label: string;
}

/**
 * A value stated as a decision rule rather than a benefit. `impact` is the
 * consequence for the client, set apart in the utility face.
 */
export interface AboutValue {
	title: string;
	description: string;
	impact: string;
}

/** One commitment about how the working relationship runs. */
export interface OperatingPrinciple {
	term: string;
	description: string;
}

/** A term/value pair in the guarantees readout. */
export interface Guarantee {
	term: string;
	value: string;
}

export interface TeamMemberLinks {
	linkedin?: string;
	x?: string;
	portfolio?: string;
}

export interface TeamMember {
	name: string;
	role: string;
	/**
	 * Path to a real photograph. Until one is supplied the frame falls back to
	 * an initials plate, so the section ships without pretending to have photos.
	 */
	photo?: string;
	links: TeamMemberLinks;
	/** Founding members are marked on the slat; staff are not. */
	isFounder?: boolean;
}
