'use client';

import { Check, ChevronDown, Search } from 'lucide-react';
import { useRef } from 'react';

import {
	ArticleCategory,
	ArticleFilterParam,
	ArticleSort,
	articleSortLabels
} from '@/enums/articles';
import { useArticleFilters } from '@/hooks/use-article-filters';
import { useDragScroll } from '@/hooks/use-drag-scroll';
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

/** Placeholder widths, so the skeleton rail reads as tags rather than blocks. */
const skeletonTagWidths = ['4rem', '7rem', '5.5rem', '6.5rem', '8rem', '5rem'];

/**
 * Search, category, sort and tags — the whole browse toolbar, docked to the
 * foot of the masthead.
 *
 * It reads and writes the query string only, and so does the results list;
 * neither owns the other's state, which is what lets them live in separate
 * parts of the tree while staying in step.
 */
export function ArticlesControls() {
	const {
		query,
		selectedCategories,
		selectedTags,
		sort,
		allTags,
		setParam,
		toggleCategory,
		toggleTag
	} = useArticleFilters();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative w-full sm:max-w-sm sm:flex-1">
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

				<CategoryFilter
					selected={selectedCategories}
					onToggle={toggleCategory}
				/>

				<div className="flex min-w-0 flex-1 items-center gap-3 sm:ml-auto sm:flex-none">
					<span className="hidden font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase sm:inline">
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
							className="h-11 w-full sm:w-44"
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

			<TagRail
				tags={allTags}
				selected={selectedTags}
				onToggle={toggleTag}
			/>
		</div>
	);
}

/**
 * Holds the toolbar's height while the controls are client-rendered, so the
 * index below doesn't jump once the query string is readable.
 */
export function ArticlesControlsSkeleton() {
	return (
		<div
			aria-hidden
			className="flex flex-col gap-4"
		>
			<div className="flex flex-wrap items-center gap-3">
				<div className="h-11 w-full rounded-md border border-border bg-card/40 sm:max-w-sm sm:flex-1" />
				<div className="h-11 min-w-0 flex-1 rounded-md border border-border bg-card/40 sm:w-52 sm:flex-none" />
				<div className="h-11 min-w-0 flex-1 rounded-md border border-border bg-card/40 sm:ml-auto sm:w-44 sm:flex-none" />
			</div>

			<div className="flex gap-2 overflow-hidden">
				{skeletonTagWidths.map((width) => (
					<div
						key={width}
						style={{ width }}
						className="h-8 shrink-0 rounded-full border border-border bg-card/40"
					/>
				))}
			</div>
		</div>
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
						'h-11 min-w-0 flex-1 justify-between gap-3 font-mono text-sm tracking-[0.15em] uppercase sm:w-52 sm:flex-none',
						selected.length && 'border-primary/50 text-primary'
					)}
				>
					<span className="truncate">{label}</span>
					<ChevronDown className="size-3.5 shrink-0 opacity-60" />
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
		// One line that pans, rather than a block that wraps to three rows and
		// pushes the results off screen as the tag list grows. The right edge
		// fades by mask rather than by a gradient panel on top: the rail sits
		// on the hero's film now, and a `from-background` panel would print a
		// pale rectangle over it.
		<div
			ref={railRef}
			{...drag}
			style={{
				maskImage:
					'linear-gradient(to right, #000 calc(100% - 3rem), transparent)'
			}}
			className="scrollbar-none flex min-w-0 gap-2 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
	);
}
