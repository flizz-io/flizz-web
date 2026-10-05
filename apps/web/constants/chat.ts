/** Crisp's chatbox loader — the same file its install snippet pulls in. */
export const crispScriptUrl = 'https://client.crisp.chat/l.js';

/**
 * Crisp's install snippet: sets the website ID it reads on load, then adds
 * its loader. The ID is passed through `JSON.stringify` so it lands as a
 * quoted string literal, whatever the env value holds.
 */
export const getCrispScript = (websiteId: string) =>
	`window.$crisp=[];window.CRISP_WEBSITE_ID=${JSON.stringify(websiteId)};(function(){var s=document.createElement('script');s.src='${crispScriptUrl}';s.async=1;document.head.appendChild(s)})()`;

/** Shows the chatbox (if hidden) and opens it on the conversation. */
export const crispOpenCommands: unknown[][] = [
	['do', 'chat:show'],
	['do', 'chat:open']
];

/** The element Crisp mounts its chatbox in, once it's actually showing. */
export const crispChatboxId = 'crisp-chatbox';
