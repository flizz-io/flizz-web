import { cn } from '@workspace/ui/lib/utils';

interface SchematicFrameProps {
	children: React.ReactNode;
	className?: string;
}

export function SchematicFrame({ children, className }: SchematicFrameProps) {
	return (
		<div className={cn('relative', className)}>
			<span className="pointer-events-none absolute -top-px -left-px size-3 border-t border-l border-primary/50" />
			<span className="pointer-events-none absolute -top-px -right-px size-3 border-t border-r border-primary/50" />
			<span className="pointer-events-none absolute -bottom-px -left-px size-3 border-b border-l border-primary/50" />
			<span className="pointer-events-none absolute -right-px -bottom-px size-3 border-r border-b border-primary/50" />
			{children}
		</div>
	);
}
