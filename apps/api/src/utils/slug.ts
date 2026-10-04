import { maxSlugLength } from '../constants/slug.js';

/**
 * "Northwind Ops — Platform" → "northwind-ops-platform". Leaves room for a
 * `-2`, `-3`… suffix; `fallback` when nothing usable is left.
 */
export function slugify(text: string, fallback: string) {
	const slug = text
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.slice(0, maxSlugLength - 4)
		.replace(/^-+|-+$/g, '');

	return slug || fallback;
}

/** The base slug, with `-2`, `-3`, … until `isTaken` says it's free. */
export async function uniqueSlug(
	base: string,
	isTaken: (slug: string) => Promise<boolean>
) {
	let candidate = base;
	for (let n = 2; await isTaken(candidate); n += 1) {
		candidate = `${base}-${n}`;
	}

	return candidate;
}
