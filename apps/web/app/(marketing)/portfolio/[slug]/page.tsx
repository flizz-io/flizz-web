import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PortfolioCta } from '@/components/features/portfolio/portfolio-cta';
import { ProjectBrief } from '@/components/features/portfolio/project-brief';
import { ProjectBuild } from '@/components/features/portfolio/project-build';
import { ProjectDetailHero } from '@/components/features/portfolio/project-detail-hero';
import { ProjectOutcome } from '@/components/features/portfolio/project-outcome';
import { ProjectRelated } from '@/components/features/portfolio/project-related';
import { siteConfig } from '@/configs/site';
import { projects } from '@/constants/portfolio';

interface ProjectPageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
	return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
	params
}: ProjectPageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = projects.find((entry) => entry.slug === slug);

	if (!project) return {};

	const url = `${siteConfig.url}/portfolio/${project.slug}`;

	return {
		title: project.name,
		description: project.summary,
		keywords: [project.sector, project.service, siteConfig.name],
		alternates: { canonical: url },
		openGraph: {
			type: 'article',
			url,
			siteName: siteConfig.fullname,
			title: project.name,
			description: project.summary,
			section: project.sector
		},
		twitter: {
			card: 'summary_large_image',
			title: project.name,
			description: project.summary
		}
	};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params;
	const project = projects.find((entry) => entry.slug === slug);

	if (!project) notFound();

	const related = projects.filter(
		(entry) =>
			entry.sector === project.sector && entry.slug !== project.slug
	);

	// "Nearby work" drops out when a sector holds only this project, so the
	// counter has to be built from what actually renders.
	const totalSections = related.length ? 5 : 4;
	const url = `${siteConfig.url}/portfolio/${project.slug}`;

	// CreativeWork rather than Article: this is a record of work done, not a
	// piece of writing, and the crumb trail is what search results actually use.
	const structuredData = [
		{
			'@context': 'https://schema.org',
			'@type': 'CreativeWork',
			name: project.name,
			description: project.summary,
			creator: {
				'@type': 'Organization',
				name: siteConfig.fullname,
				url: siteConfig.url
			},
			dateCreated: project.year,
			genre: project.service,
			about: project.sector,
			url,
			inLanguage: 'en-GB'
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: siteConfig.url
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Portfolio',
					item: `${siteConfig.url}/portfolio`
				},
				{ '@type': 'ListItem', position: 3, name: project.name }
			]
		}
	];

	return (
		<>
			<script
				type="application/ld+json"
				// Serialised from data we control, never from user input.
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData)
				}}
			/>

			<ProjectDetailHero project={project} />

			<ProjectBrief
				brief={project.brief}
				constraints={project.constraints}
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<ProjectBuild
				approach={project.approach}
				built={project.built}
				stack={project.stack}
				sectionIndex={2}
				totalSections={totalSections}
			/>
			<ProjectOutcome
				results={project.results}
				quote={project.quote}
				sectionIndex={3}
				totalSections={totalSections}
			/>
			<ProjectRelated
				projects={related}
				sector={project.sector}
				sectionIndex={4}
				totalSections={totalSections}
			/>
			<PortfolioCta
				sectionIndex={related.length ? 5 : 4}
				totalSections={totalSections}
				heading="Got a version of this problem?"
				lead={`This one ran ${project.duration.toLowerCase()} with ${project.team.toLowerCase()}. Yours will be different — a discovery call is how we find out by how much.`}
				ctaLabel="Book a discovery call →"
			/>
		</>
	);
}
