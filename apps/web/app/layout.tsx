import type { Metadata } from 'next';
import {
	IBM_Plex_Mono,
	Instrument_Serif,
	Manrope,
	Space_Grotesk
} from 'next/font/google';
import localFont from 'next/font/local';

import '@workspace/ui/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/configs/site';
import { cn } from '@workspace/ui/lib/utils';

export const metadata: Metadata = {
	// Makes every relative URL in a page's metadata resolve to an absolute one,
	// which Open Graph and canonical tags require.
	metadataBase: new URL(siteConfig.url),
	title: { default: siteConfig.name, template: `%s — ${siteConfig.name}` },
	description: siteConfig.description,
	openGraph: {
		type: 'website',
		siteName: siteConfig.fullname,
		locale: 'en_GB',
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.name,
		description: siteConfig.description
	},
	robots: { index: true, follow: true }
};

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-heading'
});

const plexMono = IBM_Plex_Mono({
	subsets: ['latin'],
	weight: ['400', '500', '600'],
	variable: '--font-mono'
});

const instrumentSerif = Instrument_Serif({
	subsets: ['latin'],
	weight: ['400'],
	style: ['normal', 'italic'],
	variable: '--font-serif'
});

const proximaNova = localFont({
	src: './fonts/ProximaNovaBold.woff',
	variable: '--font-proxima',
	weight: '600 700'
});

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn(
				'antialiased',
				manrope.variable,
				spaceGrotesk.variable,
				plexMono.variable,
				instrumentSerif.variable,
				proximaNova.variable,
				'font-sans'
			)}
		>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
