import { Footer } from '@/components/snippets/footer/footer';
import { Header } from '@/components/snippets/header/header';

export default function MarketingLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<main>{children}</main>
			<Footer />
		</>
	);
}
