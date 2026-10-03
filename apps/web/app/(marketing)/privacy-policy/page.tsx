import type { Metadata } from 'next';

import { LegalDocument } from '@/components/features/legal/legal-document';
import { siteConfig } from '@/configs/site';
import { legalPaths, privacyPolicy } from '@/constants/legal';

const url = `${siteConfig.url}${legalPaths.privacy}`;

export const metadata: Metadata = {
	title: privacyPolicy.title,
	description: privacyPolicy.lead,
	alternates: { canonical: url },
	openGraph: {
		type: 'website',
		url,
		siteName: siteConfig.fullname,
		locale: 'en_GB',
		title: `${privacyPolicy.title} — ${siteConfig.name}`,
		description: privacyPolicy.lead
	},
	twitter: {
		card: 'summary_large_image',
		title: `${privacyPolicy.title} — ${siteConfig.name}`,
		description: privacyPolicy.lead
	}
};

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
