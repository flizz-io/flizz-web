import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ArticleForm } from '@/components/features/articles/article-form';
import { DeleteArticleButton } from '@/components/features/articles/delete-article-button';
import { RecordAuthorship } from '@/components/snippets/record-authorship/record-authorship';
import { VisibilityBadge } from '@/components/snippets/visibility-badge/visibility-badge';
import {
	articleFormMessages,
	articlesMessages,
	articlesPath
} from '@/constants/articles';
import { homePath } from '@/constants/auth';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import {
	ApiError,
	Feature,
	getArticleAuthorsService,
	getArticleService,
	getArticleTagsService
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

const NOT_FOUND_STATUS = 404;
const BAD_REQUEST_STATUS = 400;

interface ArticlePageProps {
	params: Promise<{ uuid: string }>;
}

export const metadata: Metadata = { title: articlesMessages.title };

/** A deleted, unknown or malformed id is a 404. */
async function loadArticle(uuid: string) {
	try {
		return await serverCall(
			getArticleService(uuid, await serverApiContext())
		);
	} catch (error) {
		if (
			error instanceof ApiError &&
			(error.status === NOT_FOUND_STATUS ||
				error.status === BAD_REQUEST_STATUS)
		) {
			notFound();
		}
		throw error;
	}
}

/** Needs Articles › View; the form is read-only without Edit. */
export default async function ArticlePage({ params }: ArticlePageProps) {
	const user = await getCurrentUser();
	const grant = user?.permissions[Feature.ARTICLES];
	if (!grant?.view) redirect(homePath);

	const context = await serverApiContext();
	const [article, authors, tags] = await Promise.all([
		loadArticle((await params).uuid),
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
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-semibold tracking-tight">
								{article.title}
							</h1>
							<VisibilityBadge visibility={article.visibility} />
						</div>
						<p className="text-sm text-muted-foreground">
							{articleFormMessages.editLead(article.slug)}
						</p>
						<RecordAuthorship {...article} />
						{grant.edit ? null : (
							<p className="text-sm text-muted-foreground">
								{articleFormMessages.readOnly}
							</p>
						)}
					</div>
					{grant.delete ? (
						<DeleteArticleButton
							uuid={article.uuid}
							title={article.title}
						/>
					) : null}
				</div>
			</div>
			<ArticleForm
				article={article}
				canSave={grant.edit}
				authors={authors}
				tagSuggestions={tags}
			/>
		</>
	);
}
