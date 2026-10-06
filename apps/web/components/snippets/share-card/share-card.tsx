import type { ReactNode } from 'react';

import { siteConfig } from '@/configs/site';
import { shareCardColors } from '@/constants/seo';

interface ShareCardProps {
	/** Small caps line above the title — a category, sector or page name. */
	eyebrow: string;
	title: string;
	/** Optional line under the title, such as a project's headline result. */
	detail?: ReactNode;
	/** Bottom-right text — an author, a year, a URL. */
	footnote?: string;
}

/**
 * The generated Open Graph card every `opengraph-image` route renders, so the
 * site's share cards look like one family. Rendered by `next/og`, which only
 * understands inline styles and flex layout, hence no classes. Deliberately
 * plain — system fonts only, since loading the brand faces would mean shipping
 * font binaries into the bundle for a 1200x630 png.
 */
export function ShareCard({
	eyebrow,
	title,
	detail,
	footnote
}: ShareCardProps) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				background: shareCardColors.background,
				padding: '72px',
				color: shareCardColors.foreground
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: 999,
						background: shareCardColors.accent
					}}
				/>
				<div
					style={{
						fontSize: 24,
						letterSpacing: 6,
						textTransform: 'uppercase',
						color: shareCardColors.muted
					}}
				>
					{eyebrow}
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
						fontSize: title.length > 42 ? 64 : 78,
						lineHeight: 1.1,
						fontWeight: 600,
						letterSpacing: -1.5
					}}
				>
					{title}
				</div>
				{detail}
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					fontSize: 24,
					color: shareCardColors.muted
				}}
			>
				<div style={{ display: 'flex' }}>{siteConfig.name}</div>
				<div style={{ display: 'flex' }}>{footnote ?? ''}</div>
			</div>
		</div>
	);
}
