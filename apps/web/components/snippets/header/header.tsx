'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { BookCallButton } from '@/components/snippets/book-call/book-call-button';
import { Logo } from '@/components/snippets/logo/logo';
import { ThemeToggle } from '@/components/snippets/theme-toggle/theme-toggle';
import { primaryNavItems } from '@/configs/nav';
import { useIntro } from '@/contexts/intro-context';
import { IntroGate, IntroPhase } from '@/enums/intro';
import { cn } from '@workspace/ui/lib/utils';

import { MobileNav } from './mobile-nav';

gsap.registerPlugin(useGSAP);

export function Header() {
	const [scrolled, setScrolled] = useState(false);
	const headerRef = useRef<HTMLElement>(null);
	const { phase } = useIntro();

	// The home intro's entrance. Only when the intro actually played: every
	// other load, and every other page, shows the header exactly as it is.
	useGSAP(
		() => {
			const header = headerRef.current;
			if (
				!header ||
				phase !== IntroPhase.REVEALING ||
				document.documentElement.dataset.intro !== IntroGate.PLAY
			) {
				return;
			}

			const q = gsap.utils.selector(header);

			gsap.timeline({ delay: 0.35 })
				.set(header, { visibility: 'visible' })
				// The pill opens from its centre outward as it drops in and
				// comes into focus.
				.fromTo(
					q('[data-header-pill]'),
					{
						clipPath: 'inset(0% 50% 0% 50% round 999px)',
						y: -28,
						opacity: 0,
						filter: 'blur(10px)'
					},
					{
						clipPath: 'inset(0% 0% 0% 0% round 999px)',
						y: 0,
						opacity: 1,
						filter: 'blur(0px)',
						duration: 1.3,
						ease: 'expo.out',
						clearProps: 'clipPath,filter,transform,opacity'
					}
				)
				.from(
					q('[data-header-item]'),
					{
						y: -10,
						opacity: 0,
						duration: 0.7,
						ease: 'power3.out',
						stagger: 0.06,
						clearProps: 'transform,opacity'
					},
					'-=0.8'
				);
		},
		{ dependencies: [phase], scope: headerRef }
	);

	useEffect(() => {
		function onScroll() {
			setScrolled(window.scrollY > 24);
		}

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header
			ref={headerRef}
			data-intro-header
			className="fixed inset-x-0 top-4 z-40 px-0 sm:px-6 lg:px-8"
		>
			<div
				className={cn(
					'mx-auto px-4 transition-[max-width] duration-500 ease-out sm:px-8',
					scrolled ? 'max-w-5xl' : 'max-w-6xl'
				)}
			>
				<div
					data-header-pill
					className="flex h-16 items-center justify-between gap-4 rounded-full border border-border bg-card/70 pr-5 pl-5 shadow-lg shadow-black/5 backdrop-blur-lg"
				>
					<Link
						data-header-item
						href="/"
						className="flex shrink-0"
					>
						<Logo />
					</Link>

					<nav className="hidden items-center gap-1 lg:flex">
						{primaryNavItems.map((item) => (
							<Link
								key={item.href}
								data-header-item
								href={item.href}
								className="rounded-full px-3.5 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground dark:text-white/80 dark:hover:text-white"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div
						data-header-item
						className="flex items-center gap-1.5"
					>
						<ThemeToggle className="hidden" />
						<BookCallButton className="hidden rounded-full px-6 font-bold sm:inline-flex">
							Book a call
						</BookCallButton>
						<MobileNav navItems={primaryNavItems} />
					</div>
				</div>
			</div>
		</header>
	);
}
