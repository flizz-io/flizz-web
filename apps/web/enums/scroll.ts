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

/** Where a `<Pinned>` element holds while pinned — its CSS `top`, in effect. */
export enum PinOffset {
	/** Flush with the top of the viewport. */
	TOP = 'top',
	/** Clear of the floating header (7rem, i.e. `top-28`). */
	BELOW_HEADER = 'below-header',
	/** Vertically centred in the viewport. */
	CENTER = 'center'
}
