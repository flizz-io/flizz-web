/** Which way along a horizontal strip — earlier items or later ones. */
export enum ScrollDirection {
	PREVIOUS = 'previous',
	NEXT = 'next'
}

/** What the pointer badge over a scrolling strip is currently saying. */
export enum RailCursorMode {
	IDLE = 'idle',
	DRAG = 'drag',
	DETAILS = 'details'
}
