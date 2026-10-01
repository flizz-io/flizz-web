'use client';

import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

import { loginMessages } from '@/constants/messages';
import { ApiErrorCode } from '@/enums/auth';

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const BUTTON_WIDTH = 320;

interface GoogleSignInButtonProps {
	/** Where to go once signed in — already checked to be on-site. */
	returnTo: string;
}

/** The message for a failed `POST /api/auth/google`. */
async function signInErrorMessage(response: Response) {
	const body = (await response.json().catch(() => null)) as {
		error?: { code?: string };
	} | null;

	return body?.error?.code === ApiErrorCode.FORBIDDEN
		? loginMessages.noAccess
		: loginMessages.googleFailed;
}

/**
 * Google's own sign-in button (Google Identity Services). Google hands back
 * an ID token, which goes to the API through the dashboard's /api rewrite;
 * the API checks the allowlist and sets the session cookie.
 */
export function GoogleSignInButton({ returnTo }: GoogleSignInButtonProps) {
	const router = useRouter();
	const buttonRef = useRef<HTMLDivElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

	const handleCredential = useCallback(
		async ({ credential }: GoogleCredentialResponse) => {
			setError(null);
			setPending(true);

			try {
				const response = await fetch('/api/auth/google', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ credential })
				});

				if (!response.ok) {
					setError(await signInErrorMessage(response));
					return;
				}

				router.replace(returnTo);
				router.refresh();
			} catch {
				setError(loginMessages.unreachable);
			} finally {
				setPending(false);
			}
		},
		[returnTo, router]
	);

	// Runs when the script loads — and on a client-side return to /login,
	// where it's already loaded and onLoad won't fire again.
	const renderButton = useCallback(() => {
		const identity = window.google?.accounts.id;
		if (!identity || !buttonRef.current || !clientId) return;

		identity.initialize({
			client_id: clientId,
			callback: handleCredential,
			ux_mode: 'popup',
			cancel_on_tap_outside: true
		});
		identity.renderButton(buttonRef.current, {
			theme: 'outline',
			size: 'large',
			text: 'signin_with',
			shape: 'pill',
			width: BUTTON_WIDTH
		});
	}, [clientId, handleCredential]);

	useEffect(() => {
		renderButton();
	}, [renderButton]);

	if (!clientId) {
		return (
			<p
				role="alert"
				className="text-sm text-destructive"
			>
				{loginMessages.notConfigured}
			</p>
		);
	}

	return (
		<div className="flex flex-col items-center gap-3">
			<Script
				src={GOOGLE_SCRIPT_SRC}
				strategy="afterInteractive"
				onLoad={renderButton}
			/>
			<div
				ref={buttonRef}
				aria-busy={pending}
				className="flex min-h-11 justify-center"
			/>
			{error ? (
				<p
					role="alert"
					className="max-w-xs text-center text-sm text-destructive"
				>
					{error}
				</p>
			) : null}
		</div>
	);
}
