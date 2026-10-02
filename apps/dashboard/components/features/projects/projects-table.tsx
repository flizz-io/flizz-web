'use client';

import { House, Search, Star } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FeaturedToggle } from '@/components/features/projects/featured-toggle';
import { ProjectCell } from '@/components/features/projects/project-cell';
import { VisibilityBadge } from '@/components/features/projects/visibility-badge';
import { allFilterValue } from '@/constants/filters';
import {
	projectsMessages,
	sectorLabels,
	visibilityLabels
} from '@/constants/projects';
import { relativeTime } from '@/utils/relative-time';
import {
	ProjectSector,
	ProjectVisibility,
	type ProjectListItem
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

interface ProjectsTableProps {
	projects: ProjectListItem[];
	/** Shows the featured star as a toggle rather than a marker. */
	canEdit: boolean;
}

type SectorFilter = ProjectSector | typeof allFilterValue;
type VisibilityFilter = ProjectVisibility | typeof allFilterValue;

const COLUMN_COUNT = 6;

function matches(project: ProjectListItem, query: string) {
	if (!query) return true;
	const haystack = `${project.name} ${project.slug}`.toLowerCase();

	return haystack.includes(query.toLowerCase());
}

/**
 * The Projects list. A portfolio is tens of projects, not thousands, so it's
 * loaded once and filtered here — instant, no round trip per keystroke.
 */
export function ProjectsTable({ projects, canEdit }: ProjectsTableProps) {
	const [query, setQuery] = useState('');
	const [sector, setSector] = useState<SectorFilter>(allFilterValue);
	const [visibility, setVisibility] =
		useState<VisibilityFilter>(allFilterValue);

	const visible = useMemo(
		() =>
			projects.filter(
				(project) =>
					matches(project, query.trim()) &&
					(sector === allFilterValue || project.sector === sector) &&
					(visibility === allFilterValue ||
						project.visibility === visibility)
			),
		[projects, query, sector, visibility]
	);

	const nextFeaturedOrder = useMemo(
		() =>
			Math.max(
				-1,
				...projects
					.filter((project) => project.featured)
					.map((project) => project.featuredOrder)
			) + 1,
		[projects]
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative sm:w-72">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={projectsMessages.searchPlaceholder}
						aria-label={projectsMessages.searchPlaceholder}
						className="pl-9"
					/>
				</div>
				<Select
					value={sector}
					onValueChange={(value) => setSector(value as SectorFilter)}
				>
					<SelectTrigger
						className="sm:w-56"
						aria-label={projectsMessages.anySector}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={allFilterValue}>
							{projectsMessages.anySector}
						</SelectItem>
						{Object.values(ProjectSector).map((option) => (
							<SelectItem
								key={option}
								value={option}
							>
								{sectorLabels[option]}
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
						aria-label={projectsMessages.anyStatus}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={allFilterValue}>
							{projectsMessages.anyStatus}
						</SelectItem>
						{Object.values(ProjectVisibility).map((option) => (
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
								{projectsMessages.columns.project}
							</TableHead>
							<TableHead className="hidden md:table-cell">
								{projectsMessages.columns.sector}
							</TableHead>
							<TableHead className="hidden sm:table-cell">
								{projectsMessages.columns.year}
							</TableHead>
							<TableHead>
								{projectsMessages.columns.status}
							</TableHead>
							<TableHead>
								{projectsMessages.columns.placement}
							</TableHead>
							<TableHead className="hidden lg:table-cell">
								{projectsMessages.columns.updated}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{visible.length ? (
							visible.map((project) => (
								<TableRow key={project.uuid}>
									<TableCell className="max-w-72">
										<ProjectCell project={project} />
									</TableCell>
									<TableCell className="hidden text-muted-foreground md:table-cell">
										{sectorLabels[project.sector]}
									</TableCell>
									<TableCell className="hidden text-muted-foreground sm:table-cell">
										{project.year}
									</TableCell>
									<TableCell>
										<div className="flex flex-col items-start gap-1">
											<VisibilityBadge
												visibility={project.visibility}
											/>
											{project.visibility ===
												ProjectVisibility.SCHEDULED &&
											project.publishAt ? (
												<span className="text-xs text-muted-foreground">
													{projectsMessages.scheduledFor(
														relativeTime(
															project.publishAt
														)
													)}
												</span>
											) : null}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											{canEdit ? (
												<FeaturedToggle
													project={project}
													nextFeaturedOrder={
														nextFeaturedOrder
													}
												/>
											) : project.featured ? (
												<Star
													className="m-1.5 size-4 fill-amber-400 text-amber-500"
													aria-label={
														projectsMessages.featured
													}
												/>
											) : null}
											{project.showOnHome ? (
												<House
													className="m-1.5 size-4 text-muted-foreground"
													aria-label={
														projectsMessages.onHome
													}
												/>
											) : null}
										</div>
									</TableCell>
									<TableCell className="hidden text-muted-foreground lg:table-cell">
										{projectsMessages.updatedBy(
											project.updatedBy?.name ?? '—',
											relativeTime(project.updatedAt)
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
									{projects.length
										? projectsMessages.noResults
										: projectsMessages.noProjects}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
