import type { Metadata } from 'next';

import { ContactBooking } from '@/components/features/contact/contact-booking';
import { ContactChannels } from '@/components/features/contact/contact-channels';
import { ContactFaq } from '@/components/features/contact/contact-faq';
import { ContactForm } from '@/components/features/contact/contact-form';
import { ContactHero } from '@/components/features/contact/contact-hero';
import { ContactNextSteps } from '@/components/features/contact/contact-next-steps';

export const metadata: Metadata = {
	title: 'Contact',
	description:
		'Tell us what you are building, or what is breaking. An engineer replies within one business day — free discovery call, fixed-price proposal.'
};

export default function ContactPage() {
	const totalSections = 5;

	return (
		<>
			<ContactHero />
			<ContactForm
				variation="brief"
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<ContactNextSteps
				sectionIndex={2}
				totalSections={totalSections}
			/>
			<ContactBooking
				sectionIndex={3}
				totalSections={totalSections}
			/>
			<ContactChannels
				sectionIndex={4}
				totalSections={totalSections}
			/>
			<ContactFaq
				sectionIndex={5}
				totalSections={totalSections}
			/>
		</>
	);
}
