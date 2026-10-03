/** A list entry with a stable key, so reordering keeps focus and state. */
export interface KeyedItem<T> {
	key: string;
	value: T;
}
