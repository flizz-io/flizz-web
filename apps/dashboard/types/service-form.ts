import type { KeyedItem } from '@/types/list-items';
import type {
	PublishStatus,
	ServiceCategory,
	ServiceFaq
} from '@workspace/api-services';
import type { ServiceVisualKind } from '@workspace/service-visuals';

/** Everything the service form edits, as the inputs hold it. */
export interface ServiceFormValues {
	title: string;
	slug: string;
	category: ServiceCategory;
	summary: string;
	visualKind: ServiceVisualKind;
	intro: string;
	problem: string;
	deliverables: KeyedItem<string>[];
	outcomes: KeyedItem<string>[];
	engagement: string;
	faqs: KeyedItem<ServiceFaq>[];
	seoTitle: string;
	seoDescription: string;
	status: PublishStatus;
}

/** Updates one field of the form. */
export type SetServiceField = <K extends keyof ServiceFormValues>(
	field: K,
	value: ServiceFormValues[K]
) => void;

/** Props every form section takes. */
export interface ServiceSectionProps {
	values: ServiceFormValues;
	setField: SetServiceField;
	/** API messages keyed by field path — `faqs.0.answer`, `deliverables.2`. */
	errors: Record<string, string>;
}
