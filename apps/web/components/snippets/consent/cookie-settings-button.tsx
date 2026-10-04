'use client';

import { consentCopy } from '@/constants/consent';
import { useConsent } from '@/contexts/consent-context';

/** The footer's "Cookie settings" — reopens the banner to change the choice. */
export function CookieSettingsButton({ className }: { className?: string }) {
	const { openSettings } = useConsent();

	return (
		<button
			type="button"
			onClick={openSettings}
			className={className}
		>
			{consentCopy.settingsLink}
		</button>
	);
}
