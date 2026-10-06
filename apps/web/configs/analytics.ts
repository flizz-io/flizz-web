/**
 * Analytics IDs (docs/guides/analytics.md), each off while its variable is
 * unset. Set them on the Production environment only, so previews and local
 * runs never send data. Inlined at build time — redeploy after changing one.
 */
export const analyticsConfig = {
	/** Google Analytics 4 measurement ID (`G-…`). */
	gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? '',
	/** Meta Pixel ID (digits). */
	metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? ''
} as const;
