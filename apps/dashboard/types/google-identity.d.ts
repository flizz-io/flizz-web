// The slice of Google Identity Services (accounts.google.com/gsi/client) the
// sign-in button uses. https://developers.google.com/identity/gsi/web/reference/js-reference

interface GoogleCredentialResponse {
	/** The ID token — a JWT the API verifies. */
	credential: string;
}

interface GoogleIdConfiguration {
	client_id: string;
	callback: (response: GoogleCredentialResponse) => void;
	ux_mode?: 'popup' | 'redirect';
	auto_select?: boolean;
	cancel_on_tap_outside?: boolean;
}

interface GoogleButtonConfiguration {
	type?: 'standard' | 'icon';
	theme?: 'outline' | 'filled_blue' | 'filled_black';
	size?: 'large' | 'medium' | 'small';
	text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
	shape?: 'rectangular' | 'pill' | 'circle' | 'square';
	logo_alignment?: 'left' | 'center';
	width?: number;
}

interface Window {
	google?: {
		accounts: {
			id: {
				initialize: (config: GoogleIdConfiguration) => void;
				renderButton: (
					parent: HTMLElement,
					options: GoogleButtonConfiguration
				) => void;
				disableAutoSelect: () => void;
			};
		};
	};
}
