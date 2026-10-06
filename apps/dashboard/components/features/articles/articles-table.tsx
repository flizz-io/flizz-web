'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ArticleCell } from '@/components/features/articles/article-cell';
import { VisibilityBadge } from '@/components/snippets/visibility-badge/visibility-badge';
import { articleCategoryLabels, articlesMessages } from '@/constants/articles';
import { allFilterValue } from '@/constants/filters';
import { visibilityLabels } from '@/constants/projects';
import { relativeTime } from '@/utils/relative-time';
import {
	ArticleCategory,
	ArticleVisibility,
	type ArticleListItem
} from '@workspace/api-services';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@workspace/ui/components/table';

interface ArticlesTableProps {
	articles: ArticleListItem[];
}

type CategoryFilter = ArticleCategory | typeof allFilterValue;
type VisibilityFilter = ArticleVisibility | typeof allFilterValue;

const COLUMN_COUNT = 5;
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
});

function matches(article: ArticleListItem, query: string) {
	if (!query) return true;
	const haystack =
		`${article.title} ${article.slug} ${article.tags.join(' ')}`.toLowerCase();

	return haystack.includes(query.toLowerCase());
}

/**
 * The Articles list. Tens of articles, not thousands, so it's loaded once
 * and filtered here — instant, no round trip per keystroke.
 */
export function ArticlesTable({ articles }: ArticlesTableProps) {
	const [query, setQuery] = useState('');
	const [category, setCategory] = useState<CategoryFilter>(allFilterValue);
	const [visibility, setVisibility] =
		useState<VisibilityFilter>(allFilterValue);

	const visible = useMemo(
		() =>
			articles.filter(
				(article) =>
					matches(article, query.trim()) &&
					(category === allFilterValue ||
						article.category === category) &&
					(visibility === allFilterValue ||
						article.visibility === visibility)
			),
		[articles, query, category, visibility]
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative sm:w-72">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={articlesMessages.searchPlaceholder}
						aria-label={articlesMessages.searchPlaceholder}
						className="pl-9"
					/>
				</div>
				<Select
					value={category}
					onValueChange={(value) =>
						setCategory(value as CategoryFilter)
					}
				>
					<SelectTrigger
						className="sm:w-48"
						aria-label={articlesMessages.anyCategory}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={allFilterValue}>
							{articlesMessages.anyCategory}
						</SelectItem>
						{Object.values(ArticleCategory).map((option) => (
							<SelectItem
								key={option}
								value={option}
							>
								{articleCategoryLabels[option]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					value={visibility}
					onValueChange={(value) =>
						setVisibility(value as VisibilityFilter)
					}
				>
					<SelectTrigger
						className="sm:w-44"
						aria-label={articlesMessages.anyStatus}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={allFilterValue}>
							{articlesMessages.anyStatus}
						</SelectItem>
						{Object.values(ArticleVisibility).map((option) => (
							<SelectItem
								key={option}
								value={option}
							>
								{visibilityLabels[option]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								{articlesMessages.columns.article}
							</TableHead>
							<TableHead className="hidden md:table-cell">
								{articlesMessages.columns.category}
							</TableHead>
							<TableHead className="hidden md:table-cell">
								{articlesMessages.columns.author}
							</TableHead>
							<TableHead>
								{articlesMessages.columns.status}
							</TableHead>
							<TableHead className="hidden lg:table-cell">
								{articlesMessages.columns.updated}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{visible.length ? (
							visible.map((article) => (
								<TableRow key={article.uuid}>
									<TableCell className="max-w-80">
										<ArticleCell article={article} />
									</TableCell>
									<TableCell className="hidden text-muted-foreground md:table-cell">
										{
											articleCategoryLabels[
												article.category
											]
										}
									</TableCell>
									<TableCell className="hidden text-muted-foreground md:table-cell">
										{article.author?.name ??
											articlesMessages.noAuthor}
									</TableCell>
									<TableCell>
										<div className="flex flex-col items-start gap-1">
											<VisibilityBadge
												visibility={article.visibility}
											/>
											{article.visibility ===
												ArticleVisibility.SCHEDULED &&
											article.publishAt ? (
												<span className="text-xs text-muted-foreground">
													{articlesMessages.scheduledFor(
														relativeTime(
															article.publishAt
														)
													)}
												</span>
											) : article.publishedAt ? (
												<span className="text-xs text-muted-foreground">
													{dateFormatter.format(
														new Date(
															article.publishedAt
														)
													)}
												</span>
											) : null}
										</div>
									</TableCell>
									<TableCell className="hidden text-muted-foreground lg:table-cell">
										{articlesMessages.updatedBy(
											article.updatedBy?.name ?? '—',
											relativeTime(article.updatedAt)
										)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={COLUMN_COUNT}
									className="py-10 text-center text-muted-foreground"
								>
									{articles.length
										? articlesMessages.noResults
										: articlesMessages.noArticles}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
