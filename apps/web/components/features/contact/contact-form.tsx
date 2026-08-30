import type { ContactFormVariationProps } from '@/types/contact';

import { ContactFormBrief } from './contact-form-brief';
import { ContactFormClassic } from './contact-form-classic';
import { ContactFormConsole } from './contact-form-console';

/**
 * `brief` — the form as a sentence you finish.
 * `console` — an instrument panel with a readiness meter.
 * `classic` — familiar labelled fields inside a lit frame.
 */
export type ContactFormVariation = 'brief' | 'console' | 'classic';

interface ContactFormProps extends ContactFormVariationProps {
	/**
	 * Which form to render. Each variation is self-contained and they all
	 * collect the same fields through the same hook, so a page never imports
	 * one directly and swapping is a prop change rather than an import change.
	 */
	variation?: ContactFormVariation;
}

export function ContactForm({
	variation = 'brief',
	...variationProps
}: ContactFormProps) {
	if (variation === 'console')
		return <ContactFormConsole {...variationProps} />;

	if (variation === 'classic')
		return <ContactFormClassic {...variationProps} />;

	return <ContactFormBrief {...variationProps} />;
}
