import { termsAndConditions } from '@/constants/legal';
import { legalShareCardLabel, shareImageSize } from '@/constants/seo';
import { renderShareCard } from '@/utils/share-card';

export const alt = 'Flizz terms and conditions';
export const size = shareImageSize;
export const contentType = 'image/png';

export default function OpengraphImage() {
	return renderShareCard(legalShareCardLabel, termsAndConditions.title);
}
