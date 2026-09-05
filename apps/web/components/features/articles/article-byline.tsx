import { aboutTeam } from '@/constants/about';
import { ArticleByline as Byline } from '@/enums/articles';
import { getInitials } from '@/utils/team';
import { cn } from '@workspace/ui/lib/utils';

interface ArticleBylineProps {
	author: string;
	/** Which attribution renders. Both named and company forms are built. */
	variant?: Byline;
	className?: string;
}

/**
 * The choice between a named engineer and a company byline is the PM's, and it
 * has not been made — so both are built and this picks between them. Returns
 * nothing for `NONE`, where the date and reading time in the hero already carry
 * the attribution the page needs.
 */
export function ArticleBylineCard({
	author,
	variant = Byline.AUTHOR,
	className
}: ArticleBylineProps) {
	if (variant === Byline.NONE) return null;

	const member = aboutTeam.find((person) => person.name === author);
	const isNamed = variant === Byline.AUTHOR && Boolean(member);

	const name = isNamed ? author : 'Flizz';
	const detail = isNamed
		? member?.role
		: 'Written by the team that does the work';

	return (
		<aside
			className={cn(
				'mx-auto flex max-w-2xl items-center gap-4 border-t border-border pt-8',
				className
			)}
		>
			<span
				aria-hidden
				className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-card font-heading text-sm font-semibold text-foreground/40"
			>
				{isNamed ? getInitials(name) : 'FZ'}
			</span>

			<span className="min-w-0">
				<span className="block font-heading text-base font-semibold tracking-tight text-foreground">
					{name}
				</span>
				<span className="mt-0.5 block font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
					{detail}
				</span>
			</span>
		</aside>
	);
}
