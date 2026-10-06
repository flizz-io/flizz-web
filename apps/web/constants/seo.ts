/**
 * The share-card size every network expects. Uploaded share images are cropped
 * to it (`shareImage` in `@workspace/media-library`), and the generated
 * `opengraph-image` routes render at it.
 */
export const shareImageSize = { width: 1200, height: 630 } as const;
