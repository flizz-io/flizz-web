'use client';

import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { projectsMessages } from '@/constants/projects';
import {
	ApiError,
	updateProjectService,
	type ProjectListItem
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface FeaturedToggleProps {
	project: ProjectListItem;
	/** Where a newly featured project joins the reel — after the rest. */
	nextFeaturedOrder: number;
}

/** The star on a Projects row — puts a project in or out of the reel. */
export function FeaturedToggle({
	project,
	nextFeaturedOrder
}: FeaturedToggleProps) {
	const router = useRouter();
	const [featured, setFeatured] = useState(project.featured);
	const [pending, setPending] = useState(false);

	const toggle = async () => {
		const next = !featured;
		setFeatured(next);
		setPending(true);
		try {
			await updateProjectService(
				project.uuid,
				next
					? { featured: true, featuredOrder: nextFeaturedOrder }
					: { featured: false }
			);
			toast.success(
				next
					? projectsMessages.featuredOn(project.name)
					: projectsMessages.featuredOff(project.name)
			);
			router.refresh();
		} catch (error) {
			setFeatured(!next);
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
		} finally {
			setPending(false);
		}
	};

	const label = featured
		? projectsMessages.unfeature(project.name)
		: projectsMessages.feature(project.name);

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={toggle}
			disabled={pending}
			aria-pressed={featured}
			aria-label={label}
			title={label}
		>
			<Star
				className={cn(
					featured
						? 'fill-amber-400 text-amber-500'
						: 'text-muted-foreground'
				)}
			/>
		</Button>
	);
}
