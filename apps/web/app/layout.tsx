import type { Metadata } from 'next';
import {
	IBM_Plex_Mono,
	Instrument_Serif,
	Manrope,
	Space_Grotesk
} from 'next/font/google';

import '@workspace/ui/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/configs/site';
import { cn } from '@workspace/ui/lib/utils';

export const metadata: Metadata = {
	title: { default: siteConfig.name, template: `%s — ${siteConfig.name}` },
	description: siteConfig.description
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
				'font-sans'
			)}
		>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
