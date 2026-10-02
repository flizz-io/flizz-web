import { shellMessages } from '@/constants/messages';

export default function OverviewPage() {
	return (
		<>
			<h1 className="text-2xl font-semibold tracking-tight">
				{shellMessages.overviewTitle}
			</h1>
			<p className="max-w-prose text-muted-foreground">
				{shellMessages.overviewLead}
			</p>
		</>
	);
}
