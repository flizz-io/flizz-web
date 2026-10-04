import { ArrowDown, ArrowUp, X } from 'lucide-react';

import { formMessages } from '@/constants/form';
import { Button } from '@workspace/ui/components/button';

interface ListItemControlsProps {
	index: number;
	count: number;
	/** What the buttons act on, for screen readers — "Brief paragraph 2". */
	itemLabel: string;
	onMove: (offset: number) => void;
	onRemove: () => void;
	/** Hide Remove when the list may not get shorter. */
	canRemove?: boolean;
	disabled?: boolean;
}

/** Up / down / remove for one entry of a reorderable list. */
export function ListItemControls({
	index,
	count,
	itemLabel,
	onMove,
	onRemove,
	canRemove = true,
	disabled = false
}: ListItemControlsProps) {
	const { moveUp, moveDown, remove } = formMessages;

	return (
		<div className="flex shrink-0 gap-1">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				disabled={disabled || index === 0}
				onClick={() => onMove(-1)}
				aria-label={`${moveUp}: ${itemLabel}`}
				title={moveUp}
			>
				<ArrowUp />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				disabled={disabled || index === count - 1}
				onClick={() => onMove(1)}
				aria-label={`${moveDown}: ${itemLabel}`}
				title={moveDown}
			>
				<ArrowDown />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				disabled={disabled || !canRemove}
				onClick={onRemove}
				aria-label={`${remove}: ${itemLabel}`}
				title={remove}
			>
				<X />
			</Button>
		</div>
	);
}
