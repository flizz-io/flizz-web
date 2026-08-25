import Link from 'next/link';

import { Logo } from '@/components/snippets/logo/logo';
import { ThemeToggle } from '@/components/snippets/theme-toggle/theme-toggle';
import { primaryNavItems } from '@/configs/nav';
import { Button } from '@workspace/ui/components/button';

import { MobileNav } from './mobile-nav';

export function Header() {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
							className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					<Button
						asChild
						className="hidden lg:inline-flex"
					>
						<Link href="/contact">Get Started</Link>
					</Button>
					<MobileNav navItems={primaryNavItems} />
				</div>
			</div>
		</header>
	);
}
