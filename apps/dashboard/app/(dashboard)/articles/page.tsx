import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArticlesTable } from '@/components/features/articles/articles-table';
import { articlesMessages, newArticlePath } from '@/constants/articles';
import { homePath } from '@/constants/auth';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import { Feature, getArticlesService } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

export const metadata: Metadata = { title: articlesMessages.title };

/** Needs Articles › View — anyone else goes back to Overview. */
export default async function ArticlesPage() {
	const user = await getCurrentUser();
	const grant = user?.permissions[Feature.ARTICLES];
	if (!grant?.view) redirect(homePath);

	const articles = await serverCall(
		getArticlesService({}, await serverApiContext())
	);

	return (
		<>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						{articlesMessages.title}
					</h1>
					<p className="max-w-prose text-muted-foreground">
						{articlesMessages.lead}
					</p>
				</div>
				{grant.create ? (
					<Button asChild>
						<Link href={newArticlePath}>
							<Plus />
							{articlesMessages.newArticle}
						</Link>
					</Button>
				) : null}
			</div>
			<ArticlesTable articles={articles} />
		</>
	);
}
