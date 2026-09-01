'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { articles } from '@/constants/articles';
import {
	ArticleCategory,
	ArticleFilterParam,
	ArticleSort
} from '@/enums/articles';
import type { Article } from '@/types/articles';
import { getReadingMinutes } from '@/utils/articles';

function isSort(value: string | null): value is ArticleSort {
	return Object.values(ArticleSort).some((entry) => entry === value);
}

/** Comma-separated, so several selections fit one readable parameter. */
function readList(value: string | null): string[] {
	return value
		? value
				.split(',')
				.map((entry) => entry.trim())
				.filter(Boolean)
		: [];
}

/** Title, excerpt, category and tags — everything a reader might type. */
function matchesQuery(article: Article, query: string): boolean {
	const haystack = [
		article.title,
		article.excerpt,
		article.category,
		...article.tags
	]
		.join(' ')
		.toLowerCase();

	return query
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.every((term) => haystack.includes(term));
}

/**
 * Filter state lives in the query string rather than component state, so a
 * filtered view can be linked to, survives a refresh, and the back button
 * behaves. It also means the contract is already in place when the API takes
 * over filtering at Stage 13.
 *
 * Categories and tags are both multi-select. Within one facet the selections
 * are OR-ed — picking Engineering and AI widens the result — while the facets
 * themselves are AND-ed, which is what a reader means by narrowing.
 */
export function useArticleFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const query = searchParams.get(ArticleFilterParam.QUERY) ?? '';

	const selectedCategories = useMemo(() => {
		const raw = readList(searchParams.get(ArticleFilterParam.CATEGORY));

		// Anything unrecognised is dropped rather than left to match nothing.
		return Object.values(ArticleCategory).filter((entry) =>
			raw.includes(entry)
		);
	}, [searchParams]);

	const selectedTags = useMemo(
		() => readList(searchParams.get(ArticleFilterParam.TAG)),
		[searchParams]
	);

	const sortParam = searchParams.get(ArticleFilterParam.SORT);
	const sort = isSort(sortParam) ? sortParam : ArticleSort.NEWEST;

	const setParam = useCallback(
		(key: ArticleFilterParam, value: string | null) => {
			const next = new URLSearchParams(searchParams.toString());

			if (value) {
				next.set(key, value);
			} else {
				next.delete(key);
			}

			const queryString = next.toString();
			// `replace` rather than `push`: typing in a search box should not
			// fill the history stack with a step per keystroke.
			router.replace(queryString ? `?${queryString}` : '?', {
				scroll: false
			});
		},
		[router, searchParams]
	);

	const toggleInList = useCallback(
		(key: ArticleFilterParam, current: string[], value: string) => {
			const next = current.includes(value)
				? current.filter((entry) => entry !== value)
				: [...current, value];

			setParam(key, next.length ? next.join(',') : null);
		},
		[setParam]
	);

	const toggleCategory = useCallback(
		(value: ArticleCategory) =>
			toggleInList(
				ArticleFilterParam.CATEGORY,
				selectedCategories,
				value
			),
		[selectedCategories, toggleInList]
	);

	const toggleTag = useCallback(
		(value: string) =>
			toggleInList(ArticleFilterParam.TAG, selectedTags, value),
		[selectedTags, toggleInList]
	);

	const clear = useCallback(() => {
		router.replace('?', { scroll: false });
	}, [router]);

	const allTags = useMemo(
		() =>
			[...new Set(articles.flatMap((article) => article.tags))].sort(
				(a, b) => a.localeCompare(b)
			),
		[]
	);

	const results = useMemo(() => {
		const filtered = articles.filter((article) => {
			if (
				selectedCategories.length &&
				!selectedCategories.includes(article.category)
			) {
				return false;
			}

			if (
				selectedTags.length &&
				!article.tags.some((entry) => selectedTags.includes(entry))
			) {
				return false;
			}

			if (query && !matchesQuery(article, query)) return false;

			return true;
		});

		return [...filtered].sort((a, b) => {
			switch (sort) {
				case ArticleSort.OLDEST:
					return a.publishedAt.localeCompare(b.publishedAt);
				case ArticleSort.LONGEST:
					return (
						getReadingMinutes(b.body) - getReadingMinutes(a.body)
					);
				case ArticleSort.SHORTEST:
					return (
						getReadingMinutes(a.body) - getReadingMinutes(b.body)
					);
				case ArticleSort.NEWEST:
					return b.publishedAt.localeCompare(a.publishedAt);
			}
		});
	}, [query, selectedCategories, selectedTags, sort]);

	const isFiltered = Boolean(
		query || selectedCategories.length || selectedTags.length
	);

	return {
		query,
		selectedCategories,
		selectedTags,
		sort,
		allTags,
		results,
		isFiltered,
		setParam,
		toggleCategory,
		toggleTag,
		clear
	};
}
