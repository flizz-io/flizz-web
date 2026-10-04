'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { ServiceBasicsSection } from '@/components/features/services/service-basics-section';
import { ServiceCopySection } from '@/components/features/services/service-copy-section';
import { ServiceFaqsSection } from '@/components/features/services/service-faqs-section';
import { ServicePublishingSection } from '@/components/features/services/service-publishing-section';
import { ServiceSeoSection } from '@/components/features/services/service-seo-section';
import { ServiceShareImage } from '@/components/features/services/service-share-image';
import { ServiceVisualSection } from '@/components/features/services/service-visual-section';
import { servicePath, serviceFormMessages } from '@/constants/services';
import type { ServiceFormValues, SetServiceField } from '@/types/service-form';
import {
	emptyServiceValues,
	serviceToValues,
	toCreateServicePayload,
	toUpdateServicePayload
} from '@/utils/service-form';
import {
	ApiError,
	createServiceService,
	updateServiceService,
	type ServiceRecord
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

interface ServiceFormProps {
	/** Omitted for a new service. */
	service?: ServiceRecord;
	/** Edit (or Create, for a new one). Without it the form is read-only. */
	canSave: boolean;
}

const messages = serviceFormMessages;

/**
 * The whole service on one page. Fields are saved together with Save; the
 * share image is saved as it changes (and only once the service exists).
 */
export function ServiceForm({ service, canSave }: ServiceFormProps) {
	const router = useRouter();
	const [saved, setSaved] = useState(service);
	const [values, setValues] = useState<ServiceFormValues>(() =>
		service ? serviceToValues(service) : emptyServiceValues()
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [pending, setPending] = useState(false);
	const readOnly = !canSave;

	const setField = useCallback<SetServiceField>((field, value) => {
		setValues((current) => ({ ...current, [field]: value }));
	}, []);

	const refresh = useCallback(() => router.refresh(), [router]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (readOnly) return;
		setPending(true);
		setErrors({});
		try {
			if (saved) {
				const next = await updateServiceService(
					saved.uuid,
					toUpdateServicePayload(values)
				);
				setSaved(next);
				setValues(serviceToValues(next));
				toast.success(messages.saved(next.title));
				router.refresh();
			} else {
				const created = await createServiceService(
					toCreateServicePayload(values)
				);
				toast.success(messages.created(created.title));
				router.push(servicePath(created.uuid));
			}
		} catch (error) {
			if (!(error instanceof ApiError)) throw error;
			setErrors(error.fieldErrors);
			toast.error(
				Object.keys(error.fieldErrors).length
					? messages.fixErrors
					: error.message
			);
		} finally {
			setPending(false);
		}
	};

	const sectionProps = { values, setField, errors };

	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			className="flex max-w-4xl flex-col gap-6"
		>
			<fieldset
				disabled={readOnly || pending}
				className="flex min-w-0 flex-col gap-6"
			>
				<ServiceBasicsSection {...sectionProps} />
				<ServiceVisualSection {...sectionProps} />
				<ServiceCopySection {...sectionProps} />
				<ServiceFaqsSection {...sectionProps} />
				<ServiceSeoSection
					{...sectionProps}
					shareImage={
						saved ? (
							<ServiceShareImage
								serviceUuid={saved.uuid}
								initial={saved.ogImage}
								readOnly={readOnly}
								onChanged={refresh}
							/>
						) : (
							<p className="text-sm text-muted-foreground">
								{messages.fields.shareImageAfterCreate}
							</p>
						)
					}
				/>
				<ServicePublishingSection
					{...sectionProps}
					isNew={!saved}
				/>
			</fieldset>

			{readOnly ? null : (
				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={pending}
					>
						{pending
							? messages.saving
							: saved
								? messages.save
								: messages.create}
					</Button>
				</div>
			)}
		</form>
	);
}
