const replyByFormatter = new Intl.DateTimeFormat('en-GB', {
	weekday: 'short',
	day: 'numeric',
	month: 'short'
});

/**
 * The next working day after `from`, formatted for the send receipt. The page
 * promises a reply within one business day, so the receipt states the date
 * that promise lands on rather than repeating the promise back.
 */
export function formatNextBusinessDay(from: Date = new Date()): string {
	const replyBy = new Date(from);
	replyBy.setDate(replyBy.getDate() + 1);

	// Saturday and Sunday roll forward to Monday.
	while (replyBy.getDay() === 0 || replyBy.getDay() === 6) {
		replyBy.setDate(replyBy.getDate() + 1);
	}

	return replyByFormatter.format(replyBy);
}
