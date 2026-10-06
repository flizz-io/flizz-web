import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

import { blockEditorMessages } from './constants';
import { Button } from '@workspace/ui/components/button';

interface BlockControlsProps {
	index: number;
	count: number;
	/** What the buttons act on, for screen readers — "Paragraph 3". */
	label: string;
	onMove: (offset: number) => void;
	onRemove: () => void;
}

/** Up / down / remove for one block. Buttons, so they work from the keyboard. */
export function BlockControls({
	index,
	count,
	label,
	onMove,
	onRemove
}: BlockControlsProps) {
	const { moveUp, moveDown, remove } = blockEditorMessages;

	return (
		<div className="flex shrink-0 gap-1">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				disabled={index === 0}
				onClick={() => onMove(-1)}
				aria-label={`${moveUp}: ${label}`}
				title={moveUp}
			>
				<ArrowUp />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				disabled={index === count - 1}
				onClick={() => onMove(1)}
				aria-label={`${moveDown}: ${label}`}
				title={moveDown}
			>
				<ArrowDown />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				onClick={onRemove}
				aria-label={`${remove}: ${label}`}
				title={remove}
			>
				<Trash2 />
			</Button>
		</div>
	);
}
