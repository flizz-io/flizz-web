import Link from 'next/link';

import { footerLinkGroups, socialLinks } from '@/configs/footer';
import { siteConfig } from '@/configs/site';

export function Footer() {
	return (
		<footer className="border-t border-border bg-secondary/40">
			<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
					<div className="col-span-2 sm:col-span-1">
						<p className="font-heading text-lg font-semibold tracking-tight text-foreground">
							{siteConfig.name}
						</p>
						<p className="mt-4 max-w-[22ch] text-sm text-muted-foreground">
							{siteConfig.tagline}
						</p>
					</div>

					{footerLinkGroups.map((group) => (
						<div key={group.title}>
							<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
								{group.title}
							</p>
							<ul className="mt-4 space-y-2.5">
								{group.items.map((item) => (
									<li key={item.href}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="font-mono text-xs text-muted-foreground">
						© {new Date().getFullYear()} {siteConfig.name}. All
						rights reserved.
					</p>
					<div className="flex items-center gap-5">
						{socialLinks.map((social) => (
							<Link
								key={social.href}
								href={social.href}
								className="font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
							>
								{social.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
