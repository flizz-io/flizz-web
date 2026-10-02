/** An image as the dashboard sees it — URL resolved, with its size. */
export interface ImageResponse {
	/** The media file's public id. */
	uuid: string;
	url: string;
	width: number | null;
	height: number | null;
}

/** One gallery entry. `uuid` is the gallery entry's own id. */
export interface GalleryImageResponse extends ImageResponse {
	mediaUuid: string;
	caption: string | null;
	position: number;
}

/** A project's images, returned by every image endpoint. */
export interface ProjectImagesResponse {
	cover: ImageResponse | null;
	gallery: GalleryImageResponse[];
}
