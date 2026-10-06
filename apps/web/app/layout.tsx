import type { Metadata } from 'next';
import {
	IBM_Plex_Mono,
	Instrument_Serif,
	Manrope,
	Space_Grotesk
} from 'next/font/google';
import localFont from 'next/font/local';

import '@workspace/ui/globals.css';
import { Analytics } from '@/components/snippets/analytics/analytics';
import { ConsentBanner } from '@/components/snippets/consent/consent-banner';
import { CrispChat } from '@/components/snippets/crisp-chat/crisp-chat';
import { ThemeProvider } from '@/components/theme-provider';
import { animationConfig } from '@/configs/animation';
import { siteConfig } from '@/configs/site';
import { animationScaleProperty } from '@/constants/animation';
import { introGateScript } from '@/constants/intro';
import { ConsentProvider } from '@/contexts/consent-context';
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
			// Every CSS duration and delay is multiplied by this — see the
			// `duration-*` overrides in `@workspace/ui/globals.css`.
			style={
				{
					[animationScaleProperty]: animationConfig.durationScale
				} as React.CSSProperties
			}
		>
			<head>
				{/* Decides before first paint whether the home intro plays, so
				    neither the loader nor the held-back header ever flashes. */}
				<script dangerouslySetInnerHTML={{ __html: introGateScript }} />
			</head>
			<body>
				<ConsentProvider>
					<ThemeProvider>
						{children}
						{/* On <body>, outside the ScrollSmoother wrapper, so
						    its fixed position holds. */}
						<ConsentBanner />
					</ThemeProvider>
					{/* GA4 and the Meta Pixel — only after Accept. */}
					<Analytics />
				</ConsentProvider>
				<CrispChat />
			</body>
		</html>
	);
}
