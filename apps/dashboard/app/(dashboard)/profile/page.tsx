import type { Metadata } from 'next';

import { ProfileForm } from '@/components/features/profile/profile-form';
import { profileMessages } from '@/constants/profile';
import type { Profile } from '@/types/profile';
import { serverApi } from '@/utils/server-api';

export const metadata: Metadata = { title: profileMessages.title };

/** Every role's own profile. */
export default async function ProfilePage() {
	const profile = await serverApi<Profile>('/me/profile');

	return (
		<>
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					{profileMessages.title}
				</h1>
				<p className="max-w-prose text-muted-foreground">
					{profileMessages.lead}
				</p>
			</div>
			<ProfileForm profile={profile} />
		</>
	);
}
