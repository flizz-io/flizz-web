import { ScrollLink } from '@/components/snippets/scroll-link/scroll-link';
import type { LegalSection } from '@/types/legal';

interface LegalContentsProps {
	sections: LegalSection[];
}

/** Jump links to each section, numbered to match the headings. */
export function LegalContents({ sections }: LegalContentsProps) {
	return (
		<nav
			aria-label="On this page"
			className="mt-14"
		>
			<h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
				On this page
			</h2>
			<ol className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
				{sections.map((section, index) => (
					<li key={section.id}>
						<ScrollLink
							targetId={section.id}
							className="group/toc flex gap-3 text-muted-foreground transition-colors hover:text-foreground"
						>
							<span className="w-6 shrink-0 font-mono text-sm text-primary tabular-nums">
								{index + 1}.
							</span>
							<span className="underline-offset-4 group-hover/toc:underline">
								{section.title}
							</span>
						</ScrollLink>
					</li>
				))}
			</ol>
		</nav>
	);
}
