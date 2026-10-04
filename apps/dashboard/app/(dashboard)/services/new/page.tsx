import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ServiceForm } from '@/components/features/services/service-form';
import { serviceFormMessages, servicesPath } from '@/constants/services';
import { getCurrentUser } from '@/utils/get-current-user';
import { Feature } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

export const metadata: Metadata = { title: serviceFormMessages.newTitle };

/** Needs Services › Create — anyone else goes back to the list. */
export default async function NewServicePage() {
	const user = await getCurrentUser();
	if (!user?.permissions[Feature.SERVICES].create) redirect(servicesPath);

	return (
		<>
			<div className="flex flex-col gap-2">
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="self-start"
				>
					<Link href={servicesPath}>
						<ArrowLeft />
						{serviceFormMessages.backToList}
					</Link>
				</Button>
				<h1 className="text-2xl font-semibold tracking-tight">
					{serviceFormMessages.newTitle}
				</h1>
				<p className="max-w-prose text-muted-foreground">
					{serviceFormMessages.newLead}
				</p>
			</div>
			<ServiceForm canSave />
		</>
	);
}
