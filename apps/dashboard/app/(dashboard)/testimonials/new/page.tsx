import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { TestimonialForm } from '@/components/features/testimonials/testimonial-form';
import {
	testimonialFormMessages,
	testimonialsPath
} from '@/constants/testimonials';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import {
	Feature,
	getTestimonialProjectOptionsService
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

export const metadata: Metadata = { title: testimonialFormMessages.newTitle };

/** Needs Testimonials › Create — anyone else goes back to the list. */
export default async function NewTestimonialPage() {
	const user = await getCurrentUser();
	if (!user?.permissions[Feature.TESTIMONIALS].create) {
		redirect(testimonialsPath);
	}

	const projects = await serverCall(
		getTestimonialProjectOptionsService(await serverApiContext())
	);

	return (
		<>
			<div className="flex flex-col gap-2">
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="self-start"
				>
					<Link href={testimonialsPath}>
						<ArrowLeft />
						{testimonialFormMessages.backToList}
					</Link>
				</Button>
				<h1 className="text-2xl font-semibold tracking-tight">
					{testimonialFormMessages.newTitle}
				</h1>
				<p className="max-w-prose text-muted-foreground">
					{testimonialFormMessages.newLead}
				</p>
			</div>
			<TestimonialForm
				projects={projects}
				canSave
			/>
		</>
	);
}
