/**
 * The shape of work someone is writing in about. Values are stable identifiers
 * rather than display copy — every variation of the form renders its own
 * wording for the same option (see `projectScopeOptions`).
 */
export enum ProjectScope {
	NEW_BUILD = 'NEW_BUILD',
	REBUILD = 'REBUILD',
	SCALE = 'SCALE',
	FIX = 'FIX',
	UNDECIDED = 'UNDECIDED'
}

/** When they want work to begin. */
export enum ProjectStart {
	IMMEDIATELY = 'IMMEDIATELY',
	THIS_QUARTER = 'THIS_QUARTER',
	NEXT_QUARTER = 'NEXT_QUARTER',
	EXPLORING = 'EXPLORING'
}

export enum ContactFormStatus {
	IDLE = 'IDLE',
	SUBMITTING = 'SUBMITTING',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR'
}

/**
 * Field keys, kept as an enum so the completion meter and the error mapping
 * can't drift from the schema by way of a mistyped string.
 */
export enum ContactField {
	NAME = 'name',
	COMPANY = 'company',
	EMAIL = 'email',
	SCOPE = 'scope',
	START = 'start',
	MESSAGE = 'message'
}
