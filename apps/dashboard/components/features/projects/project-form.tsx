'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { ProjectBasicsSection } from '@/components/features/projects/project-basics-section';
import { ProjectImagesSection } from '@/components/features/projects/project-images-section';
import { ProjectPublishingSection } from '@/components/features/projects/project-publishing-section';
import { ProjectQuoteSection } from '@/components/features/projects/project-quote-section';
import { ProjectResultsSection } from '@/components/features/projects/project-results-section';
import { ProjectStackSection } from '@/components/features/projects/project-stack-section';
import { ProjectStorySection } from '@/components/features/projects/project-story-section';
import { SectionCard } from '@/components/features/projects/section-card';
import { projectFormMessages, projectPath } from '@/constants/projects';
import type { ProjectFormValues, SetProjectField } from '@/types/project-form';
import {
	emptyProjectValues,
	projectToValues,
	toCreatePayload,
	toUpdatePayload
} from '@/utils/project-form';
import {
	ApiError,
	createProjectService,
	updateProjectService,
	type ProjectRecord
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

interface ProjectFormProps {
	/** Omitted for a new project. */
	project?: ProjectRecord;
	/** Edit (or Create, for a new one). Without it the form is read-only. */
	canSave: boolean;
}

const messages = projectFormMessages;

/**
 * The whole project on one page. Fields are saved together with Save; images
 * are saved as they change (and only once the project exists).
 */
export function ProjectForm({ project, canSave }: ProjectFormProps) {
	const router = useRouter();
	const [saved, setSaved] = useState(project);
	const [values, setValues] = useState<ProjectFormValues>(() =>
		project ? projectToValues(project) : emptyProjectValues()
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [pending, setPending] = useState(false);
	const readOnly = !canSave;

	const setField = useCallback<SetProjectField>((field, value) => {
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
				const next = await updateProjectService(
					saved.uuid,
					toUpdatePayload(values)
				);
				setSaved(next);
				setValues(projectToValues(next));
				toast.success(messages.saved(next.name));
				router.refresh();
			} else {
				const created = await createProjectService(
					toCreatePayload(values)
				);
				toast.success(messages.created(created.name));
				router.push(projectPath(created.uuid));
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
				<ProjectBasicsSection
					{...sectionProps}
					wasPublished={Boolean(saved?.firstPublishedAt)}
					savedSlug={saved?.slug ?? null}
				/>
				<ProjectResultsSection {...sectionProps} />
				<ProjectStorySection {...sectionProps} />
				<ProjectStackSection {...sectionProps} />
				<ProjectQuoteSection {...sectionProps} />
			</fieldset>

			{saved ? (
				<ProjectImagesSection
					projectUuid={saved.uuid}
					initial={saved}
					readOnly={readOnly}
					onChanged={refresh}
				/>
			) : (
				<SectionCard
					title={messages.sections.images}
					description={messages.sections.imagesAfterCreate}
				/>
			)}

			<fieldset
				disabled={readOnly || pending}
				className="flex min-w-0 flex-col gap-6"
			>
				<ProjectPublishingSection
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
