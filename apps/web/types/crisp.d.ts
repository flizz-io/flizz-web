/**
 * The part of Crisp's browser API the site uses — https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/
 * Until its loader runs, `$crisp` is the snippet's plain array (a queue);
 * once Crisp is up it gains `is`, which is how the site tells the two apart.
 */
interface CrispApi {
	push: (command: unknown[]) => void;
	is?: (query: string) => boolean;
}

interface Window {
	$crisp?: CrispApi;
}
