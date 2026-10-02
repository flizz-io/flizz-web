import type { Metadata } from 'next';

import { GoogleSignInButton } from '@/components/features/auth/google-sign-in-button';
import { Logo } from '@/components/snippets/logo/logo';
import { loginReasonParam, returnToParam } from '@/constants/auth';
import { loginMessages } from '@/constants/messages';
import { LoginReason } from '@/enums/auth';
import { safeReturnPath } from '@/utils/safe-return-path';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@workspace/ui/components/card';

export const metadata: Metadata = { title: 'Sign in' };

interface LoginPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function single(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

function isLoginReason(value: string | undefined): value is LoginReason {
	return Object.values<string>(LoginReason).includes(value ?? '');
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const params = await searchParams;
	const returnTo = safeReturnPath(single(params[returnToParam]));
	const reason = single(params[loginReasonParam]);

	return (
		<main className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
			<Card className="w-full max-w-sm space-y-5 p-5">
				<CardHeader className="flex flex-col items-center gap-3 text-center">
					<Logo className="mb-2" />
					<CardTitle className="text-lg">
						{loginMessages.title}
					</CardTitle>
					<CardDescription>{loginMessages.lead}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
					{isLoginReason(reason) ? (
						<p
							role="status"
							className="w-full rounded-md bg-muted px-3 py-2 text-center text-sm text-muted-foreground"
						>
							{loginMessages.reasons[reason]}
						</p>
					) : null}
					<GoogleSignInButton returnTo={returnTo} />
				</CardContent>
			</Card>
		</main>
	);
}
