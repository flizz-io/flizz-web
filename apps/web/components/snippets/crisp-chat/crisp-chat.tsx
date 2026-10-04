import Script from 'next/script';

import { getCrispScript } from '@/constants/chat';

import './crisp-chat.css';

const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID?.trim();

/**
 * The Crisp chatbox, loaded once the page has finished loading so it never
 * competes with the hero. Crisp mounts its widget straight on `<body>`,
 * outside the ScrollSmoother wrapper, so its fixed position holds. Renders
 * nothing without `NEXT_PUBLIC_CRISP_WEBSITE_ID`.
 */
export function CrispChat() {
	if (!websiteId) {
		return null;
	}

	return (
		<Script
			id="crisp-chat"
			strategy="lazyOnload"
		>
			{getCrispScript(websiteId)}
		</Script>
	);
}
