import type { ReactNode } from 'react';

import { Footer } from '@/components/snippets/footer/footer';
import { Header } from '@/components/snippets/header/header';
import { SmoothScroll } from '@/components/snippets/smooth-scroll/smooth-scroll';
import { IntroProvider } from '@/contexts/intro-context';
import { ThemeLabMount } from '@workspace/theme-lab';

/**
 * Header, smoothed content and footer — the frame of every public page. The
 * marketing layout uses it, and so does the root 404, which renders outside
 * that layout for URLs that match no route.
 */
export function MarketingShell({ children }: { children: ReactNode }) {
	return (
		<IntroProvider>
			<SmoothScroll
				fixed={
					<>
						<Header />
						{/* Renders nothing unless NEXT_PUBLIC_ENABLE_THEME_LAB=true. */}
						<ThemeLabMount />
					</>
				}
			>
				{/* Holds the header's 4rem of flow now that it's fixed outside
				    the smoothed content — heroes pull up under it by that much. */}
				<div
					aria-hidden
					className="h-16"
				/>
				<main>{children}</main>
				<Footer />
			</SmoothScroll>
		</IntroProvider>
	);
}
