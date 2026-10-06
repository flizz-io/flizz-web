import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { TestimonialsTable } from '@/components/features/testimonials/testimonials-table';
import { homePath } from '@/constants/auth';
import {
	newTestimonialPath,
	testimonialsMessages
} from '@/constants/testimonials';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import { Feature, getTestimonialsService } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

export const metadata: Metadata = { title: testimonialsMessages.title };

/** Needs Testimonials › View — anyone else goes back to Overview. */
export default async function TestimonialsPage() {
	const user = await getCurrentUser();
	const grant = user?.permissions[Feature.TESTIMONIALS];
	if (!grant?.view) redirect(homePath);

	const testimonials = await serverCall(
		getTestimonialsService({}, await serverApiContext())
	);

	return (
		<>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						{testimonialsMessages.title}
					</h1>
					<p className="max-w-prose text-muted-foreground">
						{testimonialsMessages.lead}
					</p>
				</div>
				{grant.create ? (
					<Button asChild>
						<Link href={newTestimonialPath}>
							<Plus />
							{testimonialsMessages.newTestimonial}
						</Link>
					</Button>
				) : null}
			</div>
			<TestimonialsTable
				testimonials={testimonials}
				canEdit={grant.edit}
			/>
		</>
	);
}
