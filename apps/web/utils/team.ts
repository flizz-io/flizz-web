/**
 * First letters of the first and last name — the plate shown in a portrait
 * frame until a real photograph replaces it.
 */
export function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	const first = parts.at(0)?.charAt(0) ?? '';
	const last = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? '') : '';

	return `${first}${last}`.toUpperCase();
}

const smallNumbers = [
	'No',
	'One',
	'Two',
	'Three',
	'Four',
	'Five',
	'Six',
	'Seven',
	'Eight',
	'Nine',
	'Ten',
	'Eleven',
	'Twelve'
];

/** "Seven" for a heading — spelt out up to twelve, digits after. */
export function countInWords(count: number): string {
	return smallNumbers[count] ?? String(count);
}
