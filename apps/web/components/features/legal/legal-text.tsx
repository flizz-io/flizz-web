import Link from 'next/link';
import { Fragment } from 'react';

import type { LegalLink, LegalText as LegalTextValue } from '@/types/legal';

const linkClassName =
	'text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-primary';

interface LegalTextProps {
	text: LegalTextValue;
}

/** Legal copy with its inline links: site pages, mail and other sites. */
export function LegalText({ text }: LegalTextProps) {
	if (typeof text === 'string') return text;

	return text.map((part, index) => (
		<Fragment key={index}>
			{typeof part === 'string' ? part : <LegalTextLink link={part} />}
		</Fragment>
	));
}

function LegalTextLink({ link }: { link: LegalLink }) {
	if (link.href.startsWith('/')) {
		return (
			<Link
				href={link.href}
				className={linkClassName}
			>
				{link.text}
			</Link>
		);
	}

	const isExternal = link.href.startsWith('http');

	return (
		<a
			href={link.href}
			className={linkClassName}
			{...(isExternal
				? { target: '_blank', rel: 'noopener noreferrer' }
				: {})}
		>
			{link.text}
		</a>
	);
}
