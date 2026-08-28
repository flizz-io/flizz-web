/**
 * TEMPORARY DEV TOOL — delete the whole `components/dev/theme-lab` folder (and
 * its mount in `app/(marketing)/layout.tsx`) before production.
 *
 * Everything this tool needs lives in this folder rather than the app-wide
 * `constants/` and `hooks/` directories, so removing it is a single `rm -rf`
 * with no dangling imports.
 */

export const THEME_LAB_STORAGE_KEY = 'flizz:theme-lab';
export const THEME_LAB_STYLE_ID = 'theme-lab-overrides';

export type ThemeMode = 'light' | 'dark';

export type ThemeValues = Record<string, string>;

export interface ThemeOverrides {
	light: ThemeValues;
	dark: ThemeValues;
}

export interface ThemeVariable {
	name: string;
	label: string;
}

export interface ThemeVariableGroup {
	title: string;
	advanced?: boolean;
	variables: ThemeVariable[];
}

export const themeVariableGroups: ThemeVariableGroup[] = [
	{
		title: 'Base',
		variables: [
			{ name: 'background', label: 'Background' },
			{ name: 'foreground', label: 'Foreground' }
		]
	},
	{
		title: 'Brand',
		variables: [
			{ name: 'primary', label: 'Primary' },
			{ name: 'primary-foreground', label: 'Primary text' },
			{ name: 'ring', label: 'Focus ring' }
		]
	},
	{
		title: 'Surfaces',
		variables: [
			{ name: 'card', label: 'Card' },
			{ name: 'card-foreground', label: 'Card text' },
			{ name: 'popover', label: 'Popover' },
			{ name: 'popover-foreground', label: 'Popover text' }
		]
	},
	{
		title: 'Support',
		variables: [
			{ name: 'secondary', label: 'Secondary' },
			{ name: 'secondary-foreground', label: 'Secondary text' },
			{ name: 'muted', label: 'Muted' },
			{ name: 'muted-foreground', label: 'Muted text' },
			{ name: 'accent', label: 'Accent' },
			{ name: 'accent-foreground', label: 'Accent text' }
		]
	},
	{
		title: 'Lines & feedback',
		variables: [
			{ name: 'border', label: 'Border' },
			{ name: 'input', label: 'Input border' },
			{ name: 'destructive', label: 'Destructive' }
		]
	},
	{
		title: 'Charts',
		advanced: true,
		variables: [
			{ name: 'chart-1', label: 'Chart 1' },
			{ name: 'chart-2', label: 'Chart 2' },
			{ name: 'chart-3', label: 'Chart 3' },
			{ name: 'chart-4', label: 'Chart 4' },
			{ name: 'chart-5', label: 'Chart 5' }
		]
	},
	{
		title: 'Sidebar',
		advanced: true,
		variables: [
			{ name: 'sidebar', label: 'Sidebar' },
			{ name: 'sidebar-foreground', label: 'Sidebar text' },
			{ name: 'sidebar-primary', label: 'Sidebar primary' },
			{
				name: 'sidebar-primary-foreground',
				label: 'Sidebar primary text'
			},
			{ name: 'sidebar-accent', label: 'Sidebar accent' },
			{ name: 'sidebar-accent-foreground', label: 'Sidebar accent text' },
			{ name: 'sidebar-border', label: 'Sidebar border' },
			{ name: 'sidebar-ring', label: 'Sidebar ring' }
		]
	}
];

/**
 * Mirrors `packages/ui/src/styles/globals.css`. Only used to seed the pickers
 * with a starting swatch — "Reset" clears the overrides entirely, so the real
 * stylesheet always wins even if these drift.
 */
export const defaultThemeValues: ThemeOverrides = {
	light: {
		background: '#fdfcff',
		foreground: '#0b0812',
		card: '#ffffff',
		'card-foreground': '#0b0812',
		popover: '#ffffff',
		'popover-foreground': '#0b0812',
		primary: '#5e17eb',
		'primary-foreground': '#ffffff',
		secondary: '#efeaf9',
		'secondary-foreground': '#2f1868',
		muted: '#f2f0f7',
		'muted-foreground': '#55506a',
		accent: '#efeaf9',
		'accent-foreground': '#2f1868',
		destructive: 'oklch(0.577 0.245 27.325)',
		border: '#e2ddec',
		input: '#e2ddec',
		ring: '#5e17eb',
		'chart-1': '#5e17eb',
		'chart-2': '#8b5cf6',
		'chart-3': '#4c11c4',
		'chart-4': '#b794f6',
		'chart-5': '#55506a',
		sidebar: '#ffffff',
		'sidebar-foreground': '#0b0812',
		'sidebar-primary': '#5e17eb',
		'sidebar-primary-foreground': '#ffffff',
		'sidebar-accent': '#efeaf9',
		'sidebar-accent-foreground': '#2f1868',
		'sidebar-border': '#e2ddec',
		'sidebar-ring': '#5e17eb'
	},
	dark: {
		background: '#08060d',
		foreground: '#f7f5fb',
		card: '#100c1a',
		'card-foreground': '#f7f5fb',
		popover: '#100c1a',
		'popover-foreground': '#f7f5fb',
		primary: '#8b5cf6',
		'primary-foreground': '#08060d',
		secondary: '#1a1428',
		'secondary-foreground': '#f7f5fb',
		muted: '#150f22',
		'muted-foreground': '#9d94b8',
		accent: '#1a1428',
		'accent-foreground': '#f7f5fb',
		destructive: 'oklch(0.704 0.191 22.216)',
		border: 'oklch(1 0 0 / 10%)',
		input: 'oklch(1 0 0 / 15%)',
		ring: '#8b5cf6',
		'chart-1': '#8b5cf6',
		'chart-2': '#a78bfa',
		'chart-3': '#5e17eb',
		'chart-4': '#c4b5fd',
		'chart-5': '#9d94b8',
		sidebar: '#100c1a',
		'sidebar-foreground': '#f7f5fb',
		'sidebar-primary': '#8b5cf6',
		'sidebar-primary-foreground': '#08060d',
		'sidebar-accent': '#1a1428',
		'sidebar-accent-foreground': '#f7f5fb',
		'sidebar-border': 'oklch(1 0 0 / 10%)',
		'sidebar-ring': '#8b5cf6'
	}
};

export interface ThemePreset {
	name: string;
	hue: number;
}

export const themePresets: ThemePreset[] = [
	{ name: 'Violet', hue: 292 },
	{ name: 'Indigo', hue: 275 },
	{ name: 'Blue', hue: 255 },
	{ name: 'Teal', hue: 195 },
	{ name: 'Emerald', hue: 155 },
	{ name: 'Amber', hue: 75 },
	{ name: 'Rose', hue: 15 }
];

/**
 * Presets are generated from a single hue in oklch rather than hand-written hex
 * pairs. That keeps them compact and structurally enforces the rule that dark
 * mode gets a lighter, more vivid tint of the same hue instead of reusing the
 * light-mode value.
 */
export function buildPresetValues(hue: number): ThemeOverrides {
	return {
		light: {
			primary: `oklch(0.47 0.25 ${hue})`,
			'primary-foreground': '#ffffff',
			ring: `oklch(0.47 0.25 ${hue})`,
			secondary: `oklch(0.95 0.035 ${hue})`,
			'secondary-foreground': `oklch(0.32 0.14 ${hue})`,
			accent: `oklch(0.95 0.035 ${hue})`,
			'accent-foreground': `oklch(0.32 0.14 ${hue})`,
			muted: `oklch(0.965 0.012 ${hue})`,
			border: `oklch(0.91 0.02 ${hue})`,
			input: `oklch(0.91 0.02 ${hue})`,
			'chart-1': `oklch(0.47 0.25 ${hue})`,
			'chart-2': `oklch(0.62 0.19 ${hue})`
		},
		dark: {
			primary: `oklch(0.68 0.19 ${hue})`,
			'primary-foreground': `oklch(0.16 0.03 ${hue})`,
			ring: `oklch(0.68 0.19 ${hue})`,
			secondary: `oklch(0.26 0.045 ${hue})`,
			'secondary-foreground': `oklch(0.96 0.01 ${hue})`,
			accent: `oklch(0.26 0.045 ${hue})`,
			'accent-foreground': `oklch(0.96 0.01 ${hue})`,
			muted: `oklch(0.23 0.04 ${hue})`,
			'chart-1': `oklch(0.68 0.19 ${hue})`,
			'chart-2': `oklch(0.76 0.15 ${hue})`
		}
	};
}
