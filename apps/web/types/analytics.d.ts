/**
 * gtag and fbq as the site calls them. Both exist only after the visitor
 * accepts and their snippet runs — always check before calling.
 */
interface Window {
	gtag?: (...args: unknown[]) => void;
	fbq?: (...args: unknown[]) => void;
	[gaDisableKey: `ga-disable-${string}`]: boolean | undefined;
}
