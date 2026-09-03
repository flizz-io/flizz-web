import type { ProjectSector } from '@/enums/portfolio';
import type { ServiceCategory } from '@/enums/services';

/**
 * One measured change. Stated as a pair rather than a single figure because a
 * portfolio's claim is never the number on its own — "four hours" means
 * nothing until you know it used to be two days.
 */
export interface ProjectResult {
	/** What was measured — "Time to close a month". */
	label: string;
	/** Where it started. */
	from: string;
	/** Where it landed. */
	to: string;
}

export interface ProjectQuote {
	text: string;
	/** Name and role of whoever said it. */
	attribution: string;
}

/**
 * What the index, the home strip and the detail hero all need. The Projects
 * CRUD will eventually supply these same fields, so the shape here is the
 * contract page code is written against.
 */
export interface Project {
	/** Also the detail route segment: /portfolio/[slug]. */
	slug: string;
	name: string;
	/** Anonymised descriptor — the client's shape, not their trading name. */
	client: string;
	/** Which group the project sits in on the index. */
	sector: ProjectSector;
	/** Which part of the catalogue delivered it. */
	service: ServiceCategory;
	/** The service page this project is evidence for: /services/[slug]. */
	serviceSlug: string;
	/** Year of delivery. String, since nothing does arithmetic on it. */
	year: string;
	/** One line. Carries the index row and the home strip card. */
	summary: string;
	/**
	 * At least one. The first is the headline change and is what the index row
	 * and the home card show, so order matters.
	 */
	results: ProjectResult[];
	/**
	 * Highlighted work. The reel plays these and nothing else; everything left
	 * over falls to the index below it. A flag rather than a hand-kept list, so
	 * the Projects CRUD can offer it as a checkbox on the record itself.
	 */
	featured?: boolean;
	/**
	 * Path to a real screenshot. Unfilled slots render the registration marks
	 * used elsewhere on the site rather than invented cover art.
	 */
	image?: string;
}

/**
 * The case study itself. Kept separate from `Project` so the index and the home
 * strip are not forced to carry copy they never render.
 */
export interface ProjectDetail extends Project {
	/** How long the engagement ran. */
	duration: string;
	/** Team shape — "Two engineers, one designer". */
	team: string;
	/** The situation we were called into. One paragraph per entry. */
	brief: string[];
	/** What the solution had to survive. */
	constraints: string[];
	/** How the work was approached. One paragraph per entry. */
	approach: string[];
	/** What was handed over. */
	built: string[];
	/** Named tools and languages, rendered as chips. */
	stack: string[];
	quote?: ProjectQuote;
}
