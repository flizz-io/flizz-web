'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { RoleBadge } from '@/components/features/team/role-badge';
import { ImageUploader } from '@/components/snippets/image-uploader/image-uploader';
import { profileMessages } from '@/constants/profile';
import type { Profile, ProfileInput } from '@/types/profile';
import { ApiError } from '@/utils/api-error';
import { clientApi, clientUpload } from '@/utils/client-api';
import { initials } from '@/utils/user-display';
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';

interface ProfileFormProps {
	profile: Profile;
}

const PHOTO_PATH = '/me/photo';

const textFields: {
	key: keyof ProfileInput;
	label: string;
	type: 'text' | 'url';
}[] = [
	{ key: 'firstName', label: profileMessages.firstName, type: 'text' },
	{ key: 'lastName', label: profileMessages.lastName, type: 'text' }
];

const linkFields: { key: keyof ProfileInput; label: string }[] = [
	{ key: 'linkedinUrl', label: profileMessages.linkedin },
	{ key: 'xUrl', label: profileMessages.x },
	{ key: 'portfolioUrl', label: profileMessages.portfolio }
];

function inputOf(profile: Profile): ProfileInput {
	return {
		firstName: profile.firstName ?? '',
		lastName: profile.lastName ?? '',
		linkedinUrl: profile.linkedinUrl ?? '',
		xUrl: profile.xUrl ?? '',
		portfolioUrl: profile.portfolioUrl ?? ''
	};
}

/** The signed-in user's own profile: photo, name and links. */
export function ProfileForm({ profile: initial }: ProfileFormProps) {
	const router = useRouter();
	const [profile, setProfile] = useState(initial);
	const [values, setValues] = useState<ProfileInput>(() => inputOf(initial));
	const [pending, setPending] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const photo = profile.photoUrl ?? profile.googleAvatarUrl;

	/** Takes the saved profile and refreshes the shell (header avatar, name). */
	const accept = (saved: Profile) => {
		setProfile(saved);
		router.refresh();
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setPending(true);
		setFieldErrors({});
		try {
			const saved = await clientApi<Profile>('/me/profile', {
				method: 'PATCH',
				body: values
			});
			accept(saved);
			setValues(inputOf(saved));
			toast.success(profileMessages.saved);
		} catch (error) {
			if (error instanceof ApiError) {
				setFieldErrors(error.fieldErrors);
				if (!Object.keys(error.fieldErrors).length)
					toast.error(error.message);
			}
		} finally {
			setPending(false);
		}
	};

	const field = (
		key: keyof ProfileInput,
		label: string,
		type: 'text' | 'url'
	) => (
		<div
			key={key}
			className="flex flex-col gap-2"
		>
			<Label htmlFor={`profile-${key}`}>{label}</Label>
			<Input
				id={`profile-${key}`}
				type={type}
				value={values[key]}
				onChange={(event) =>
					setValues((current) => ({
						...current,
						[key]: event.target.value
					}))
				}
				placeholder={
					type === 'url' ? profileMessages.linkPlaceholder : undefined
				}
				maxLength={type === 'url' ? 300 : 60}
				aria-invalid={Boolean(fieldErrors[key])}
			/>
			{fieldErrors[key] ? (
				<p className="text-sm text-destructive">{fieldErrors[key]}</p>
			) : null}
		</div>
	);

	return (
		<div className="grid max-w-4xl gap-6 lg:grid-cols-[18rem_1fr]">
			<Card>
				<CardHeader>
					<CardTitle>{profileMessages.photoSection}</CardTitle>
					<CardDescription>
						{profileMessages.photoHint}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-start gap-4">
					<Avatar className="size-28">
						{photo ? (
							<AvatarImage
								src={photo}
								alt=""
								referrerPolicy="no-referrer"
							/>
						) : null}
						<AvatarFallback className="text-2xl">
							{initials(profile)}
						</AvatarFallback>
					</Avatar>
					<ImageUploader
						hasImage={Boolean(profile.photoUrl)}
						onUpload={async (file, size) => {
							accept(
								await clientUpload<Profile>(
									PHOTO_PATH,
									file,
									size
								)
							);
							toast.success(profileMessages.photoSaved);
						}}
						onRemove={async () => {
							const saved = await clientApi<Profile>(PHOTO_PATH, {
								method: 'DELETE'
							});
							accept(saved);
							toast.success(
								saved.googleAvatarUrl
									? profileMessages.photoRemovedGoogle
									: profileMessages.photoRemoved
							);
						}}
					/>
				</CardContent>
			</Card>

			<form
				onSubmit={handleSubmit}
				noValidate
			>
				<Card>
					<CardHeader>
						<CardTitle>{profileMessages.detailsSection}</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<dl className="grid gap-4 text-sm sm:grid-cols-3">
							<div className="flex flex-col gap-1">
								<dt className="text-muted-foreground">
									{profileMessages.email}
								</dt>
								<dd className="truncate font-medium">
									{profile.email}
								</dd>
							</div>
							<div className="flex flex-col gap-1">
								<dt className="text-muted-foreground">
									{profileMessages.role}
								</dt>
								<dd>
									<RoleBadge role={profile.role} />
								</dd>
							</div>
							<div className="flex flex-col gap-1">
								<dt className="text-muted-foreground">
									{profileMessages.designation}
								</dt>
								<dd className="font-medium">
									{profile.designation ??
										profileMessages.noDesignation}
								</dd>
								<dd className="text-xs text-muted-foreground">
									{profileMessages.designationHint}
								</dd>
							</div>
						</dl>

						<div className="grid gap-4 sm:grid-cols-2">
							{textFields.map(({ key, label, type }) =>
								field(key, label, type)
							)}
						</div>

						<fieldset className="flex flex-col gap-4">
							<legend className="mb-3 text-sm font-medium">
								{profileMessages.linksSection}
							</legend>
							{linkFields.map(({ key, label }) =>
								field(key, label, 'url')
							)}
						</fieldset>

						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={pending}
							>
								{profileMessages.save}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}
