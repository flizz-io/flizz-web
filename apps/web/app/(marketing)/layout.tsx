import { MarketingShell } from '@/components/snippets/marketing-shell/marketing-shell';

export default function MarketingLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <MarketingShell>{children}</MarketingShell>;
}
