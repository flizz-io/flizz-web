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
		<SmoothScroll
			fixed={
				<>
					<Header />
					{/* TODO: remove with the `@workspace/theme-lab` package before production. */}
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
	);
}
