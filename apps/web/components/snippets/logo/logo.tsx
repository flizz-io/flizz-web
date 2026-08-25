import { siteConfig } from '@/configs/site';
import { cn } from '@workspace/ui/lib/utils';

interface LogoProps {
	className?: string;
}

export function Logo({ className }: LogoProps) {
	return (
		<span
			className={cn(
				'font-heading text-lg font-semibold tracking-tight text-foreground',
				className
			)}
		>
			{siteConfig.name}
		</span>
	);
}
