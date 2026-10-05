'use client';

import { Loader2, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';

import { contactIntegrations } from '@/configs/contact';
import {
	bookCallDialogCopy,
	CALENDLY_ORIGIN,
	CALENDLY_READY_FALLBACK_MS,
	calendlyReadyEvents
} from '@/constants/booking';
import type { ContactPrefill } from '@/contexts/contact-prefill-context';
import { buildCalendlyUrl } from '@/utils/calendly';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@workspace/ui/components/dialog';
import { cn } from '@workspace/ui/lib/utils';

interface BookCallDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	prefill: ContactPrefill;
}

interface CalendlyMessage {
	event?: string;
}

/**
 * The scheduler in a fixed-size dialog — full screen on phones. Calendly
 * scrolls inside its own frame, so picking a date or a time never moves the
 * page behind it.
 */
export function BookCallDialog({
	open,
	onOpenChange,
	prefill
}: BookCallDialogProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				overlayClassName="bg-black/60 supports-backdrop-filter:backdrop-blur-sm"
				className="flex h-dvh w-full max-w-none flex-col gap-0 overflow-hidden rounded-none bg-background p-0 sm:h-[min(88dvh,760px)] sm:max-w-[min(1040px,calc(100%-3rem))] sm:rounded-2xl"
			>
				<DialogHeader className="flex-row items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
					<div className="flex flex-col gap-1.5">
						<DialogTitle className="text-lg font-semibold">
							{bookCallDialogCopy.title}
						</DialogTitle>
						<DialogDescription>
							{bookCallDialogCopy.description}
						</DialogDescription>
					</div>
					<DialogClose asChild>
						<Button
							variant="ghost"
							size="icon"
							className="shrink-0 rounded-full"
						>
							<X className="size-5" />
							<span className="sr-only">
								{bookCallDialogCopy.close}
							</span>
						</Button>
					</DialogClose>
				</DialogHeader>

				{/* Mounted only while open: each opening starts a fresh
				    scheduler with the latest prefill. */}
				{open ? <CalendlyFrame prefill={prefill} /> : null}
			</DialogContent>
		</Dialog>
	);
}

function CalendlyFrame({ prefill }: { prefill: ContactPrefill }) {
	const { resolvedTheme } = useTheme();
	const [ready, setReady] = useState(false);

	const src = useMemo(
		() =>
			resolvedTheme
				? buildCalendlyUrl(contactIntegrations.calendlyUrl, {
						prefill,
						dark: resolvedTheme === 'dark',
						pageSearch: window.location.search,
						pagePath: window.location.pathname,
						embedDomain: window.location.host
					})
				: null,
		[prefill, resolvedTheme]
	);

	useEffect(() => {
		const onMessage = (event: MessageEvent<CalendlyMessage>) => {
			if (event.origin !== CALENDLY_ORIGIN) return;
			if (calendlyReadyEvents.includes(event.data?.event ?? '')) {
				setReady(true);
			}
		};
		window.addEventListener('message', onMessage);

		return () => window.removeEventListener('message', onMessage);
	}, []);

	useEffect(() => {
		if (ready) return;
		const timer = window.setTimeout(
			() => setReady(true),
			CALENDLY_READY_FALLBACK_MS
		);

		return () => window.clearTimeout(timer);
	}, [ready]);

	return (
		<div className="relative min-h-0 flex-1">
			{ready ? null : (
				<div className="absolute inset-0 flex items-center justify-center gap-2.5 text-sm text-muted-foreground">
					<Loader2 className="size-4 animate-spin text-primary" />
					{bookCallDialogCopy.loading}
				</div>
			)}
			{src ? (
				<iframe
					src={src}
					title={bookCallDialogCopy.frameTitle}
					className={cn(
						'absolute inset-0 size-full transition-opacity duration-300',
						ready ? 'opacity-100' : 'opacity-0'
					)}
					// Calendly's page declares no colour scheme; against the
					// site's dark one Chrome would paint the frame opaque white.
					style={{ colorScheme: 'light' }}
				/>
			) : null}
		</div>
	);
}
