import Image from 'next/image';

import { siteConfig } from '@/configs/site';
import { cn } from '@workspace/ui/lib/utils';

interface LogoProps {
	className?: string;
}

export function Logo({ className }: LogoProps) {
	return (
		<span className={cn('relative inline-flex h-7 w-auto', className)}>
			<Image
				src="/logo/logo-dark.svg"
				alt={siteConfig.name}
				width={200}
				height={56}
				priority
				className="h-7 w-auto dark:hidden"
			/>
			<Image
				src="/logo/logo-light.svg"
				alt={siteConfig.name}
				width={200}
				height={56}
				priority
				className="hidden h-7 w-auto dark:block"
			/>
		</span>
	);
}
