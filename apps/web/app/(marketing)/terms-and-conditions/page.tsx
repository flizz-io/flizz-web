import type { Metadata } from 'next';

import { LegalDocument } from '@/components/features/legal/legal-document';
import { siteConfig } from '@/configs/site';
import { legalPaths, termsAndConditions } from '@/constants/legal';

const url = `${siteConfig.url}${legalPaths.terms}`;

export const metadata: Metadata = {
	title: termsAndConditions.title,
	description: termsAndConditions.lead,
	alternates: { canonical: url },
	openGraph: {
		type: 'website',
		url,
		siteName: siteConfig.fullname,
		locale: 'en_GB',
		title: `${termsAndConditions.title} — ${siteConfig.name}`,
		description: termsAndConditions.lead
	},
	twitter: {
		card: 'summary_large_image',
		title: `${termsAndConditions.title} — ${siteConfig.name}`,
		description: termsAndConditions.lead
	}
};

export default function TermsAndConditionsPage() {
	return (
		<LegalDocument
			document={termsAndConditions}
			companion={{ label: 'Privacy policy', href: legalPaths.privacy }}
		/>
	);
}
