import { Fragment } from 'react';

import type {
	LegalBlock,
	LegalSection as LegalSectionValue
} from '@/types/legal';

import { LegalProcessors } from './legal-processors';
import { LegalText } from './legal-text';

interface LegalSectionProps {
	section: LegalSectionValue;
	/** 1-based. Legal text refers to sections by number, so it is shown. */
	number: number;
}

export function LegalSection({ section, number }: LegalSectionProps) {
	return (
		<section
			id={section.id}
			aria-labelledby={`${section.id}-title`}
			className="scroll-mt-24 pt-16 first:pt-0"
		>
			<h2
				id={`${section.id}-title`}
				className="flex items-baseline gap-4 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl"
			>
				<span className="w-8 shrink-0 font-mono text-base font-normal text-primary tabular-nums">
					{number}.
				</span>
				{section.title}
			</h2>
			<div className="sm:pl-12">
				{section.blocks.map((block, index) => (
					<Fragment key={index}>{renderBlock(block)}</Fragment>
				))}
			</div>
		</section>
	);
}

function renderBlock(block: LegalBlock) {
	switch (block.type) {
		case 'paragraph':
			return (
				<p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
					<LegalText text={block.text} />
				</p>
			);

		case 'subheading':
			return (
				<h3 className="mt-9 font-heading text-lg font-semibold tracking-tight text-foreground">
					{block.text}
				</h3>
			);

		case 'list':
			return (
				<ul className="mt-5 list-disc space-y-3 pl-6">
					{block.items.map((item, index) => (
						<li
							key={index}
							className="pl-2 text-lg leading-relaxed text-pretty text-muted-foreground marker:text-primary"
						>
							<LegalText text={item} />
						</li>
					))}
				</ul>
			);

		case 'processors':
			return <LegalProcessors />;
	}
}
