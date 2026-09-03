import { ImageResponse } from 'next/og';

import { siteConfig } from '@/configs/site';
import { projects } from '@/constants/portfolio';

export const alt = 'Flizz project';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
	return projects.map((project) => ({ slug: project.slug }));
}

/**
 * Generated rather than designed per project, so every share card is correct
 * the moment a case study is published. The headline result travels with the
 * name — the card has to say what the work did, not just what it was called.
 * Deliberately plain: system fonts only, since loading the brand faces would
 * mean shipping font binaries into the edge bundle for a 1200x630 png.
 */
export default async function OpengraphImage({
	params
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = projects.find((entry) => entry.slug === slug);
	const headline = project?.results[0];

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				background: '#08060d',
				padding: '72px',
				color: '#f7f5fb'
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: 999,
						background: '#8b5cf6'
					}}
				/>
				<div
					style={{
						fontSize: 24,
						letterSpacing: 6,
						textTransform: 'uppercase',
						color: '#9d94b8'
					}}
				>
					{project?.sector ?? siteConfig.name}
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 28,
					maxWidth: 1000
				}}
			>
				<div
					style={{
						display: 'flex',
						fontSize: project && project.name.length > 26 ? 68 : 82,
						lineHeight: 1.1,
						fontWeight: 600,
						letterSpacing: -1.5
					}}
				>
					{project?.name ?? siteConfig.tagline}
				</div>

				{headline ? (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 20,
							fontSize: 30
						}}
					>
						<div style={{ display: 'flex', color: '#9d94b8' }}>
							{headline.from}
						</div>
						<div
							style={{
								width: 40,
								height: 1,
								background: '#4b4360'
							}}
						/>
						<div style={{ display: 'flex', color: '#b9a7ff' }}>
							{headline.to}
						</div>
					</div>
				) : null}
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					fontSize: 24,
					color: '#9d94b8'
				}}
			>
				<div style={{ display: 'flex' }}>{siteConfig.fullname}</div>
				<div style={{ display: 'flex' }}>{project?.year ?? ''}</div>
			</div>
		</div>,
		size
	);
}
