import Link from 'next/link';

import { footerLinkGroups, socialLinks } from '@/configs/footer';
import { siteConfig } from '@/configs/site';

export function Footer() {
	return (
		<footer className="dark relative overflow-hidden border-t border-border bg-background text-foreground">
			<div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
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
				<div className="my-4 w-full">
					<p
						aria-hidden
						className="text-center font-heading text-[18vw] leading-none font-semibold tracking-tight text-foreground/5 select-none"
					>
						{siteConfig.fullname}
					</p>
				</div>

				<div className="flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
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
