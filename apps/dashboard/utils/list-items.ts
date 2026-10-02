import type { KeyedItem } from '@/types/project-form';

let lastKey = 0;

/** A key unique within this page — list keys only, never rendered. */
export function nextKey() {
	lastKey += 1;
	return `item-${lastKey}`;
}

export function toKeyed<T>(values: T[]): KeyedItem<T>[] {
	return values.map((value) => ({ key: nextKey(), value }));
}

export function fromKeyed<T>(items: KeyedItem<T>[]): T[] {
	return items.map((item) => item.value);
}

/** Moves the item at `from` by `offset` places; out of range is a no-op. */
export function moveItem<T>(items: T[], from: number, offset: number): T[] {
	const to = from + offset;
	if (to < 0 || to >= items.length) return items;

	const next = [...items];
	const [moved] = next.splice(from, 1);
	if (moved !== undefined) next.splice(to, 0, moved);
	return next;
}

export function removeItem<T>(items: T[], index: number): T[] {
	return items.filter((_, position) => position !== index);
}

export function replaceItem<T>(
	items: KeyedItem<T>[],
	index: number,
	value: T
): KeyedItem<T>[] {
	return items.map((item, position) =>
		position === index ? { ...item, value } : item
	);
}
