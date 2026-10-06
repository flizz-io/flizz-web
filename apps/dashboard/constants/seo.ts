/** Where search engines start cutting — the SEO counters warn past these. */
export const searchSnippetTargets = {
	titleMax: 60,
	descriptionMin: 140,
	descriptionMax: 160
} as const;

/** The share image — 1200 × 630, the card every network expects. */
export const shareImageSize = { width: 1200, height: 630 } as const;

/** Wording shared by every "Search & social" form section. */
export const seoMessages = {
	searchPreview: 'Search result preview'
} as const;
