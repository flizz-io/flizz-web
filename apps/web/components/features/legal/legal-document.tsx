import type { LegalDocument as LegalDocumentValue } from '@/types/legal';
import type { NavItem } from '@/types/nav';

import { LegalContents } from './legal-contents';
import { LegalHero } from './legal-hero';
import { LegalSection } from './legal-section';
import { LegalSummary } from './legal-summary';

interface LegalDocumentProps {
	document: LegalDocumentValue;
	companion: NavItem;
}

/** A full legal page: hero, short version, contents, then the sections. */
export function LegalDocument({ document, companion }: LegalDocumentProps) {
	return (
		<>
			<LegalHero
				title={document.title}
				lead={document.lead}
				updatedAt={document.updatedAt}
				companion={companion}
			/>
			<div className="px-4 pb-28 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl">
					<LegalSummary items={document.summary} />
					<LegalContents sections={document.sections} />
					<div className="mt-16 border-t border-border pt-16">
						{document.sections.map((section, index) => (
							<LegalSection
								key={section.id}
								section={section}
								number={index + 1}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
