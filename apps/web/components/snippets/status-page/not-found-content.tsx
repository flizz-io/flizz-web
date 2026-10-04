import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { StatusPage } from '@/components/snippets/status-page/status-page';
import { notFoundCopy, statusPageLinks } from '@/constants/status-pages';

/** The 404 message with the main sections as the way out. */
export function NotFoundContent() {
	return (
		<StatusPage
			code={notFoundCopy.code}
			title={notFoundCopy.title}
			lead={notFoundCopy.lead}
		>
			<ul className="mt-10 grid max-w-xl grid-cols-2 border-t border-border sm:grid-cols-4">
				{statusPageLinks.map((link) => (
					<li
						key={link.href}
						className="border-b border-border"
					>
						<Link
							href={link.href}
							className="group flex items-center justify-between gap-2 py-4 pr-4 font-heading text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:text-primary"
						>
							{link.label}
							<ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary motion-reduce:transition-none" />
						</Link>
					</li>
				))}
			</ul>
			<Link
				href="/"
				className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
			>
				<ArrowLeft className="size-4" />
				{notFoundCopy.home}
			</Link>
		</StatusPage>
	);
}
