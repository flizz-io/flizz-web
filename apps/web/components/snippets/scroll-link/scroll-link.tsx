'use client';

import { useScrollToId } from '@/hooks/use-scroll-to-id';

interface ScrollLinkProps {
	/** Id of the element to scroll to, without the `#`. */
	targetId: string;
	children: React.ReactNode;
	className?: string;
}

/**
 * An in-page jump that still works on the second press. A plain `#id` anchor
 * only scrolls when it changes the URL, so once the hash is already set the
 * link goes dead — and it would bypass Lenis besides. This keeps the anchor
 * for its semantics and does the scrolling itself.
 */
export function ScrollLink({ targetId, children, className }: ScrollLinkProps) {
	const scrollToId = useScrollToId();

	return (
		<a
			href={`#${targetId}`}
			className={className}
			onClick={(event) => {
				event.preventDefault();
				scrollToId(targetId);
			}}
		>
			{children}
		</a>
	);
}
