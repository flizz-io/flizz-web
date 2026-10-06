import type { Metadata } from 'next';

import { LegalDocument } from '@/components/features/legal/legal-document';
import { legalPaths, termsAndConditions } from '@/constants/legal';
import { buildPageMetadata } from '@/utils/metadata';

export const metadata: Metadata = buildPageMetadata({
	title: termsAndConditions.title,
	description: termsAndConditions.lead,
	path: legalPaths.terms
});

export default function TermsAndConditionsPage() {
	return (
		<LegalDocument
			document={termsAndConditions}
			companion={{ label: 'Privacy policy', href: legalPaths.privacy }}
		/>
	);
}
