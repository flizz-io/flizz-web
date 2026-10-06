import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArticleForm } from '@/components/features/articles/article-form';
import { articleFormMessages, articlesPath } from '@/constants/articles';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import {
	Feature,
	getArticleAuthorsService,
	getArticleTagsService
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

export const metadata: Metadata = { title: articleFormMessages.newTitle };

/** Needs Articles › Create — anyone else goes back to the list. */
export default async function NewArticlePage() {
	const user = await getCurrentUser();
	if (!user?.permissions[Feature.ARTICLES].create) redirect(articlesPath);

	const context = await serverApiContext();
	const [authors, tags] = await Promise.all([
		serverCall(getArticleAuthorsService(context)),
		serverCall(getArticleTagsService(context))
	]);

	return (
		<>
			<div className="flex flex-col gap-2">
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="self-start"
				>
					<Link href={articlesPath}>
						<ArrowLeft />
						{articleFormMessages.backToList}
					</Link>
				</Button>
				<h1 className="text-2xl font-semibold tracking-tight">
					{articleFormMessages.newTitle}
				</h1>
				<p className="max-w-prose text-muted-foreground">
					{articleFormMessages.newLead}
				</p>
			</div>
			<ArticleForm
				canSave
				authors={authors}
				tagSuggestions={tags}
			/>
		</>
	);
}
