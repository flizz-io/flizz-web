import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@workspace/ui/components/sonner';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';

export const metadata: Metadata = {
	title: { default: 'Flizz Admin', template: '%s · Flizz Admin' },
	robots: { index: false, follow: false }
};

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-mono'
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
				fontMono.variable,
				'font-sans',
				geist.variable
			)}
		>
			<body>
				<ThemeProvider>
					<TooltipProvider>{children}</TooltipProvider>
					<Toaster richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
