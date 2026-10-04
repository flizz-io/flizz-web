/**
 * Development tool, shown only with NEXT_PUBLIC_ENABLE_THEME_LAB=true — see
 * this package's README.
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
