/** e.g. "12 August 2026" — spelled out, since articles are read not scanned. */
export function formatArticleDate(isoDate: string): string {
	return new Date(isoDate).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}
