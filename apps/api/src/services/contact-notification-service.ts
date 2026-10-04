import { createTransport, type Transporter } from 'nodemailer';

import { env } from '../configs/env.js';
import {
	NOTIFY_EXCERPT_LENGTH,
	NOTIFY_TIMEOUT_MS,
	SMTP_TLS_PORT,
	contactScopeLabels,
	contactStartLabels,
	dashboardMessagePath,
	notifySenderName
} from '../constants/contact.js';
import type { ContactMessage } from '../generated/prisma/client.js';

type NotifiedMessage = Pick<
	ContactMessage,
	'uuid' | 'name' | 'company' | 'email' | 'scope' | 'start' | 'message'
>;

function excerptOf(message: string) {
	return message.length > NOTIFY_EXCERPT_LENGTH
		? `${message.slice(0, NOTIFY_EXCERPT_LENGTH).trimEnd()}…`
		: message;
}

function dashboardLinkOf(uuid: string) {
	return env.dashboardUrl
		? `${env.dashboardUrl}${dashboardMessagePath}${uuid}`
		: null;
}

function subjectOf(message: NotifiedMessage) {
	return message.company
		? `New enquiry: ${message.name} (${message.company})`
		: `New enquiry: ${message.name}`;
}

/** The plain-text body — no HTML, so nothing the visitor typed is markup. */
function textOf(message: NotifiedMessage) {
	const link = dashboardLinkOf(message.uuid);

	return [
		`Name: ${message.name}`,
		`Company: ${message.company ?? '—'}`,
		`Email: ${message.email}`,
		`Project: ${contactScopeLabels[message.scope]}`,
		`Start: ${contactStartLabels[message.start]}`,
		'',
		excerptOf(message.message),
		...(link ? ['', `Open in the dashboard: ${link}`] : [])
	].join('\n');
}

/** Slack reads `&`, `<` and `>` as markup — escape what the visitor typed. */
function slackEscape(text: string) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

let transport: Transporter | null = null;

/** One SMTP connection setup per process, made on first use. */
function mailTransport(user: string, password: string) {
	const { host, port } = env.contactNotify.smtp;

	transport ??= createTransport({
		host,
		port,
		secure: port === SMTP_TLS_PORT,
		auth: { user, pass: password },
		connectionTimeout: NOTIFY_TIMEOUT_MS,
		greetingTimeout: NOTIFY_TIMEOUT_MS,
		socketTimeout: NOTIFY_TIMEOUT_MS
	});

	return transport;
}

/**
 * Email over SMTP — Gmail by default (`SMTP_USER` + an App Password). On
 * once there's a sender, a password and recipients. Sent from `SMTP_USER`,
 * with Reply-To set to the enquirer so replying answers them.
 */
async function sendEmail(message: NotifiedMessage) {
	const { smtp, to } = env.contactNotify;
	if (!smtp.user || !smtp.password || to.length === 0) return null;

	await mailTransport(smtp.user, smtp.password).sendMail({
		from: { name: notifySenderName, address: smtp.user },
		to,
		replyTo: { name: message.name, address: message.email },
		subject: subjectOf(message),
		text: textOf(message)
	});
}

async function post(url: string, body: unknown) {
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS)
	});
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

/** Slack through an incoming webhook. */
function sendSlack(message: NotifiedMessage) {
	const { slackWebhookUrl } = env.contactNotify;
	if (!slackWebhookUrl) return null;

	const text = `*${slackEscape(subjectOf(message))}*\n${slackEscape(textOf(message))}`;

	return post(slackWebhookUrl, { text });
}

/**
 * Tells the team about a new message on every configured channel. Never
 * throws: the message is already saved, and a failed alert mustn't turn the
 * visitor's submission into an error. Awaited (not fire-and-forget) because
 * a serverless function may be frozen as soon as it responds.
 */
export async function notifyNewContactMessage(message: NotifiedMessage) {
	const channels = [
		['email', sendEmail(message)],
		['Slack', sendSlack(message)]
	] as const;

	const results = await Promise.allSettled(
		channels.map(([, sending]) => sending)
	);

	results.forEach((result, index) => {
		if (result.status === 'rejected') {
			const reason: unknown = result.reason;
			console.warn(
				`Contact notification by ${channels[index]?.[0]} failed:`,
				reason instanceof Error ? reason.message : reason
			);
		}
	});
}
