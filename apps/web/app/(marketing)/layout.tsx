import { Footer } from '@/components/snippets/footer/footer';
import { Header } from '@/components/snippets/header/header';
import { SmoothScroll } from '@/components/snippets/smooth-scroll/smooth-scroll';
import { ThemeLabMount } from '@workspace/theme-lab';

export default function MarketingLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SmoothScroll>
			<Header />
			<main>{children}</main>
			<Footer />
			{/* TODO: remove with the `@workspace/theme-lab` package before production. */}
			<ThemeLabMount />
		</SmoothScroll>
	);
}
