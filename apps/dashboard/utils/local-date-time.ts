const pad = (value: number) => String(value).padStart(2, '0');

/** ISO → the `YYYY-MM-DDTHH:mm` a `datetime-local` input shows, local time. */
export function isoToLocalInput(iso: string) {
	if (!iso) return '';
	const date = new Date(iso);

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** A `datetime-local` value (read as local time) → ISO, or '' if empty. */
export function localInputToIso(local: string) {
	if (!local) return '';
	const date = new Date(local);

	return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
