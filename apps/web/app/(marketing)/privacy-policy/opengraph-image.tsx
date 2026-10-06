import { privacyPolicy } from '@/constants/legal';
import { legalShareCardLabel, shareImageSize } from '@/constants/seo';
import { renderShareCard } from '@/utils/share-card';

export const alt = 'Flizz privacy policy';
export const size = shareImageSize;
export const contentType = 'image/png';

export default function OpengraphImage() {
	return renderShareCard(legalShareCardLabel, privacyPolicy.title);
}
