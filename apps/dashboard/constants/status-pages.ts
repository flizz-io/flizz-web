import { homePath } from '@/constants/auth';

export const notFoundMessages = {
	metaTitle: 'Not found',
	title: 'Nothing here',
	body: 'This page doesn’t exist, or the record was deleted.',
	home: 'Go to Overview',
	homeHref: homePath
} as const;

export const errorMessages = {
	title: 'Something went wrong',
	body: 'The page couldn’t load. Try again — if it keeps failing, the API may be down.',
	retry: 'Try again',
	home: 'Go to Overview',
	homeHref: homePath
} as const;
