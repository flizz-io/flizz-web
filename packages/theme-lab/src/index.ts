/**
 * TEMPORARY DEV TOOL — see this package's README for removal steps.
 *
 * Only the mount is exported: it lazy-loads the panel internally, so importing
 * the component directly here would pull it into the initial bundle.
 */

export { ThemeLabMount } from './theme-lab-mount';
export type {
	ThemeMode,
	ThemeOverrides,
	ThemePreset
} from './theme-lab-config';
