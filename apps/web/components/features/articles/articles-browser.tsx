'use client';

import { ArrowUpRight, Check, ChevronDown, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import {
	ArticleCategory,
	ArticleFilterParam,
	ArticleSort,
	articleSortLabels
} from '@/enums/articles';
import { useArticleFilters } from '@/hooks/use-article-filters';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { formatArticleDate, getReadingMinutes } from '@/utils/articles';
import { Button } from '@workspace/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';

interface ArticlesBrowserProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * Search, filter and sort over the index.
 *
 * A client component, but still server-rendered — the initial HTML contains
 * every article, so the page is complete for crawlers and for anyone before
 * hydration. Filtering only takes over once JavaScript arrives.
 *
 * The featured card is inside this component rather than beside it because it
 * has to disappear while a filter is active: promoting one piece above a set
 * the reader has deliberately narrowed makes the result look wrong.
 */
export function ArticlesBrowser({
	sectionIndex,
	totalSections,
	className
}: ArticlesBrowserProps) {
	const {
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
	} = useArticleFilters();

	const [featured, ...rest] = results;
	const rows = isFiltered ? results : rest;

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<SectionTag
					index={sectionIndex}
					total={totalSections}
					label="Browse"
				/>

				<div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
					<div className="relative w-full lg:max-w-sm">
						<Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							value={query}
							onChange={(event) =>
								setParam(
									ArticleFilterParam.QUERY,
									event.target.value
								)
							}
							placeholder="Search articles"
							aria-label="Search articles"
							className="h-11 pl-10"
						/>
					</div>

					<div className="flex items-center gap-3">
						<span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
							Sort
						</span>
						<Select
							value={sort}
							onValueChange={(value) =>
								setParam(ArticleFilterParam.SORT, value)
							}
						>
							<SelectTrigger
								aria-label="Sort articles"
								className="h-11 w-44"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.values(ArticleSort).map((option) => (
									<SelectItem
										key={option}
										value={option}
									>
										{articleSortLabels[option]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
					<CategoryFilter
						selected={selectedCategories}
						onToggle={toggleCategory}
					/>

					<TagRail
						tags={allTags}
						selected={selectedTags}
						onToggle={toggleTag}
					/>
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
					<p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
						{results.length}{' '}
						{results.length === 1 ? 'article' : 'articles'}
						{isFiltered ? ' matched' : ''}
					</p>

					{isFiltered ? (
						<button
							type="button"
							onClick={clear}
							className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-foreground hover:underline"
						>
							<X className="size-3.5" />
							Clear filters
						</button>
					) : null}
				</div>

				{/* Only when unfiltered — see the note on the component. */}
				{!isFiltered && featured ? (
					<Link
						href={`/articles/${featured.slug}`}
						className="group/lead mt-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
					>
						{/* Beside the copy rather than spanning the width: a
						    full-bleed 21:9 plate here repeats the detail page's
						    banner and swallows the section on the way past. */}
						<div className="relative aspect-16/9 overflow-hidden rounded-xl border border-border transition-colors group-hover/lead:border-primary/40">
							<MediaSlot
								src={featured.coverImage}
								alt={featured.title}
								label="Cover pending"
								sizes="(min-width: 1024px) 34rem, 100vw"
							/>
						</div>

						<div>
							<p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
								<span className="text-primary">
									{featured.category}
								</span>
								<span className="text-border">·</span>
								<time dateTime={featured.publishedAt}>
									{formatArticleDate(featured.publishedAt)}
								</time>
								<span className="text-border">·</span>
								{getReadingMinutes(featured.body)} min read
							</p>
							<h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground transition-colors group-hover/lead:text-primary sm:text-4xl">
								{featured.title}
							</h2>
							<p className="mt-5 text-lg text-pretty text-muted-foreground">
								{featured.excerpt}
							</p>
							<span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] text-foreground uppercase underline-offset-4 group-hover/lead:text-primary group-hover/lead:underline">
								Read it
								<ArrowUpRight className="size-3.5 transition-transform group-hover/lead:translate-x-0.5 group-hover/lead:-translate-y-0.5" />
							</span>
						</div>
					</Link>
				) : null}

				{rows.length ? (
					<ul className="mt-10">
						{rows.map((article) => (
							<li key={article.slug}>
								<Link
									href={`/articles/${article.slug}`}
									className="group/row grid gap-2 border-b border-border py-6 first:border-t sm:grid-cols-[9.5rem_7rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
								>
									<time
										dateTime={article.publishedAt}
										className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase"
									>
										{formatArticleDate(article.publishedAt)}
									</time>

									<span className="relative hidden aspect-16/9 overflow-hidden rounded-md border border-border transition-colors group-hover/row:border-primary/40 sm:mt-0.5 sm:block sm:self-start">
										<MediaSlot
											src={article.coverImage}
											alt={article.title}
											label="Cover"
											sizes="7rem"
										/>
									</span>

									<span className="min-w-0">
										<span className="block font-heading text-lg font-semibold tracking-tight text-balance text-foreground transition-colors group-hover/row:text-primary sm:text-xl">
											{article.title}
										</span>
										<span className="mt-1.5 block max-w-xl text-sm text-pretty text-muted-foreground">
											{article.excerpt}
										</span>
										<span className="mt-3 flex flex-wrap gap-2">
											{article.tags.map((entry) => (
												<span
													key={entry}
													className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase"
												>
													{entry}
												</span>
											))}
										</span>
									</span>

									<span className="flex items-center gap-4 font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
										{article.category}
										<span className="text-border">·</span>
										{getReadingMinutes(article.body)} min
										<ArrowUpRight className="size-4 shrink-0 transition-transform group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-primary" />
									</span>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
						<p className="font-heading text-lg font-semibold text-foreground">
							Nothing matches that
						</p>
						<p className="max-w-sm text-sm text-pretty text-muted-foreground">
							Try a shorter search, or drop one of the filters.
						</p>
						<button
							type="button"
							onClick={clear}
							className="mt-2 font-mono text-[0.65rem] tracking-[0.18em] text-primary uppercase underline-offset-4 hover:underline"
						>
							Clear filters
						</button>
					</div>
				)}
			</div>
		</section>
	);
}

function CategoryFilter({
	selected,
	onToggle
}: {
	selected: ArticleCategory[];
	onToggle: (value: ArticleCategory) => void;
}) {
	const label =
		selected.length === 0
			? 'All categories'
			: selected.length === 1
				? selected[0]
				: `${selected.length} categories`;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'h-10 shrink-0 justify-between gap-3 font-mono text-[0.65rem] tracking-[0.15em] uppercase lg:w-56',
						selected.length && 'border-primary/50 text-primary'
					)}
				>
					{label}
					<ChevronDown className="size-3.5 opacity-60" />
				</Button>
			</DropdownMenuTrigger>

			{/* Checkbox items rather than a native multi-select: the roster is
			    four fixed values, and a list of ticks reads faster than a
			    control that needs a modifier key to use. */}
			<DropdownMenuContent
				align="start"
				className="w-56"
			>
				<DropdownMenuLabel className="font-mono text-[0.6rem] tracking-[0.2em] uppercase">
					Category
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{Object.values(ArticleCategory).map((category) => (
					<DropdownMenuCheckboxItem
						key={category}
						checked={selected.includes(category)}
						// Radix closes on select by default, which would make
						// picking a second category a second trip.
						onSelect={(event) => event.preventDefault()}
						onCheckedChange={() => onToggle(category)}
						// The built-in indicator only appears once something is
						// ticked, so an untouched menu gives no sign it takes
						// more than one answer. Hidden in favour of a box that
						// is always visible.
						className="gap-2.5 pr-2 pl-2 [&_[data-slot=dropdown-menu-checkbox-item-indicator]]:hidden"
					>
						{/* Presentational only — the menu item itself carries
						    the checkbox role and aria-checked, and nesting a
						    real control inside it would fight for focus. */}
						<span
							aria-hidden
							className={cn(
								'flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors',
								selected.includes(category)
									? 'border-primary bg-primary text-primary-foreground'
									: 'border-muted-foreground/50'
							)}
						>
							{selected.includes(category) ? (
								<Check className="size-3" />
							) : null}
						</span>
						{category}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function TagRail({
	tags,
	selected,
	onToggle
}: {
	tags: string[];
	selected: string[];
	onToggle: (value: string) => void;
}) {
	const railRef = useRef<HTMLDivElement>(null);
	const drag = useDragScroll(railRef);

	return (
		<div className="relative min-w-0 flex-1">
			{/* One line that pans, rather than a block that wraps to three rows
			    and pushes the results off screen as the tag list grows. */}
			<div
				ref={railRef}
				{...drag}
				className="scrollbar-none flex gap-2 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
			>
				{tags.map((tag) => {
					const isActive = selected.includes(tag);

					return (
						<button
							key={tag}
							type="button"
							aria-pressed={isActive}
							onClick={() => onToggle(tag)}
							className={cn(
								'shrink-0 rounded-full border px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.15em] whitespace-nowrap uppercase transition-colors',
								isActive
									? 'border-primary bg-primary/10 text-primary'
									: 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
							)}
						>
							{tag}
						</button>
					);
				})}
			</div>

			{/* Says there is more to the right without adding a control. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"
			/>
		</div>
	);
}
