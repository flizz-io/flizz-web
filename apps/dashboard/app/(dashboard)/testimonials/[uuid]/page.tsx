import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { DeleteTestimonialButton } from '@/components/features/testimonials/delete-testimonial-button';
import { TestimonialForm } from '@/components/features/testimonials/testimonial-form';
import { TestimonialStatusBadge } from '@/components/features/testimonials/testimonial-status-badge';
import { RecordAuthorship } from '@/components/snippets/record-authorship/record-authorship';
import { homePath } from '@/constants/auth';
import {
	testimonialFormMessages,
	testimonialsMessages,
	testimonialsPath
} from '@/constants/testimonials';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import {
	ApiError,
	Feature,
	getTestimonialProjectOptionsService,
	getTestimonialService
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

const NOT_FOUND_STATUS = 404;
const BAD_REQUEST_STATUS = 400;

interface TestimonialPageProps {
	params: Promise<{ uuid: string }>;
}

export const metadata: Metadata = { title: testimonialsMessages.title };

/** A deleted, unknown or malformed id is a 404. */
async function loadTestimonial(uuid: string) {
	try {
		return await serverCall(
			getTestimonialService(uuid, await serverApiContext())
		);
	} catch (error) {
		if (
			error instanceof ApiError &&
			(error.status === NOT_FOUND_STATUS ||
				error.status === BAD_REQUEST_STATUS)
		) {
			notFound();
		}
		throw error;
	}
}

/** Needs Testimonials › View; the form is read-only without Edit. */
export default async function TestimonialPage({
	params
}: TestimonialPageProps) {
	const user = await getCurrentUser();
	const grant = user?.permissions[Feature.TESTIMONIALS];
	if (!grant?.view) redirect(homePath);

	const [testimonial, projects] = await Promise.all([
		loadTestimonial((await params).uuid),
		serverCall(
			getTestimonialProjectOptionsService(await serverApiContext())
		)
	]);

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
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-semibold tracking-tight">
								{testimonial.authorName}
							</h1>
							<TestimonialStatusBadge
								status={testimonial.status}
							/>
						</div>
						<p className="text-sm text-muted-foreground">
							{testimonial.authorRole}
						</p>
						<RecordAuthorship {...testimonial} />
						{grant.edit ? null : (
							<p className="text-sm text-muted-foreground">
								{testimonialFormMessages.readOnly}
							</p>
						)}
					</div>
					{grant.delete ? (
						<DeleteTestimonialButton
							uuid={testimonial.uuid}
							authorName={testimonial.authorName}
						/>
					) : null}
				</div>
			</div>
			<TestimonialForm
				testimonial={testimonial}
				projects={projects}
				canSave={grant.edit}
			/>
		</>
	);
}
