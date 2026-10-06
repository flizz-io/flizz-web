import { Plus } from 'lucide-react';

import {
	blockEditorMessages,
	blockTypeLabels,
	blockTypeOrder
} from './constants';
import type { ArticleBlockType } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';

interface AddBlockMenuProps {
	onAdd: (type: ArticleBlockType) => void;
	disabled?: boolean;
	/** The compact "+" between blocks, or the full button under the last. */
	compact?: boolean;
}

/** Picks a block type to insert. */
export function AddBlockMenu({ onAdd, disabled, compact }: AddBlockMenuProps) {
	const { addBlock, addBlockAfter } = blockEditorMessages;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				disabled={disabled}
			>
				{compact ? (
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label={addBlockAfter}
						title={addBlockAfter}
					>
						<Plus />
					</Button>
				) : (
					<Button
						type="button"
						variant="outline"
					>
						<Plus />
						{addBlock}
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{blockTypeOrder.map((type) => (
					<DropdownMenuItem
						key={type}
						onSelect={() => onAdd(type)}
					>
						{blockTypeLabels[type]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
