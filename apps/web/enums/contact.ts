/**
 * The shape of work someone is writing in about, and when they want to begin.
 * The API's own enums, so what the form sends can't drift from what it
 * accepts. Values are stable identifiers rather than display copy — every
 * variation of the form renders its own wording (see `projectScopeChoices`).
 */
export {
	ContactScope as ProjectScope,
	ContactStart as ProjectStart
} from '@workspace/api-services';

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
