'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/snippets/logo/logo';
import { ThemeToggle } from '@/components/snippets/theme-toggle/theme-toggle';
import { primaryNavItems } from '@/configs/nav';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { MobileNav } from './mobile-nav';

export function Header() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		function onScroll() {
			setScrolled(window.scrollY > 24);
		}

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header className="sticky top-4 z-40 px-0 sm:px-6 lg:px-8">
			<div
				className={cn(
					'mx-auto px-4 transition-[max-width] duration-500 ease-out sm:px-8',
					scrolled ? 'max-w-5xl' : 'max-w-7xl'
				)}
			>
				<div className="flex h-16 items-center justify-between gap-4 rounded-full border border-border bg-card/70 pr-5 pl-5 shadow-lg shadow-black/5 backdrop-blur-lg">
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
								className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground dark:text-white/80 dark:hover:text-white"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-1.5">
						<ThemeToggle />
						<Button
							asChild
							className="hidden rounded-full px-6 font-bold sm:inline-flex"
						>
							<Link href="/contact">Book a call</Link>
						</Button>
						<MobileNav navItems={primaryNavItems} />
					</div>
				</div>
			</div>
		</header>
	);
}
