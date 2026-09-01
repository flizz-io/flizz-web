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
