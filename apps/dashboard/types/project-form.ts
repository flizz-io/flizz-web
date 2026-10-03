import type { KeyedItem } from '@/types/list-items';
import type {
	ProjectSector,
	ProjectStatus,
	ServiceCategory
} from '@workspace/api-services';

export interface ResultValue {
	label: string;
	from: string;
	to: string;
}

/** The four case-study lists, in the order the form shows them. */
export type StoryField = 'brief' | 'constraints' | 'approach' | 'built';

/**
 * Everything the form edits, as inputs hold it — numbers and the publish
 * date as strings until submit.
 */
export interface ProjectFormValues {
	name: string;
	slug: string;
	client: string;
	sector: ProjectSector;
	/** Narrows the Service dropdown — the project's category is its service's. */
	serviceCategory: ServiceCategory;
	/** '' until one is chosen. */
	serviceUuid: string;
	year: string;
	summary: string;
	results: KeyedItem<ResultValue>[];
	duration: string;
	team: string;
	brief: KeyedItem<string>[];
	constraints: KeyedItem<string>[];
	approach: KeyedItem<string>[];
	built: KeyedItem<string>[];
	stack: string[];
	quoteText: string;
	quoteAttribution: string;
	status: ProjectStatus;
	/** ISO, or '' for none. The input shows it in the viewer's time zone. */
	publishAt: string;
	featured: boolean;
	featuredOrder: string;
	showOnHome: boolean;
	homeOrder: string;
}

/** Updates one field of the form. */
export type SetProjectField = <K extends keyof ProjectFormValues>(
	field: K,
	value: ProjectFormValues[K]
) => void;

/** Props every form section takes. */
export interface ProjectSectionProps {
	values: ProjectFormValues;
	setField: SetProjectField;
	/** API messages keyed by field path — `results.0.label`, `brief.2`. */
	errors: Record<string, string>;
}
