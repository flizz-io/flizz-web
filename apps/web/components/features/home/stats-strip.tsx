import { Reveal } from '@/components/snippets/reveal/reveal';
import { heroScrollTargetId, stats } from '@/constants/home';

export function StatsStrip() {
	return (
		<section
			id={heroScrollTargetId}
			className="scroll-mt-24 border-b border-border"
		>
			<div className="mx-auto grid max-w-6xl divide-y divide-border px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
				{stats.map((stat, index) => (
					<Reveal
						key={stat.label}
						delay={index * 80}
						className="flex flex-col items-center gap-2 px-6 py-10 text-center"
					>
						<span className="font-heading text-5xl font-semibold tracking-tight text-primary sm:text-6xl">
							{stat.value}
						</span>
						<span className="max-w-[20ch] text-sm text-muted-foreground">
							{stat.label}
						</span>
					</Reveal>
				))}
			</div>
		</section>
	);
}
