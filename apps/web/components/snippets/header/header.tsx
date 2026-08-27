import Link from 'next/link';

import { Logo } from '@/components/snippets/logo/logo';
import { ThemeToggle } from '@/components/snippets/theme-toggle/theme-toggle';
import { primaryNavItems } from '@/configs/nav';
import { Button } from '@workspace/ui/components/button';

import { MobileNav } from './mobile-nav';

export function Header() {
	return (
		<header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 rounded-full border border-border bg-card/70 pr-5 pl-5 shadow-lg shadow-black/5 backdrop-blur-lg">
				<Link
					href="/"
					className="shrink-0"
				>
					<Logo />
				</Link>

				<nav className="hidden items-center gap-1 lg:flex">
					{primaryNavItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-1.5">
					<ThemeToggle />
					<Button
						asChild
						className="hidden rounded-full lg:inline-flex"
					>
						<Link href="/contact">Get Started</Link>
					</Button>
					<MobileNav navItems={primaryNavItems} />
				</div>
			</div>
		</header>
	);
}
