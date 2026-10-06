import type { Metadata } from 'next';

import { LegalDocument } from '@/components/features/legal/legal-document';
import { legalPaths, privacyPolicy } from '@/constants/legal';
import { buildPageMetadata } from '@/utils/metadata';

export const metadata: Metadata = buildPageMetadata({
	title: privacyPolicy.title,
	description: privacyPolicy.lead,
	path: legalPaths.privacy
});

export default function PrivacyPolicyPage() {
	return (
		<LegalDocument
			document={privacyPolicy}
			companion={{
				label: 'Terms and conditions',
				href: legalPaths.terms
			}}
		/>
	);
}
