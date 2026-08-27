import { Footer } from '@/components/snippets/footer/footer';
import { Header } from '@/components/snippets/header/header';
import { SmoothScroll } from '@/components/snippets/smooth-scroll/smooth-scroll';

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
		</SmoothScroll>
	);
}
