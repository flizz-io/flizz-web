import { shareImageSize } from '@/constants/seo';
import { RoutePath } from '@/enums/routes';
import { renderStaticPageShareCard } from '@/utils/share-card';

export const alt = 'Flizz — custom software and AI automation studio';
export const size = shareImageSize;
export const contentType = 'image/png';

export default function OpengraphImage() {
	return renderStaticPageShareCard(RoutePath.HOME);
}
