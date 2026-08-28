'use client';

/** TEMPORARY DEV TOOL — see `theme-lab-config.ts`. */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Copy, RotateCcw, Settings2, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import { useIsDarkTheme } from '@workspace/ui/hooks/use-is-dark-theme';
import { cssColorToHex } from '@workspace/ui/lib/css-color';
import { cn } from '@workspace/ui/lib/utils';

import {
	buildPresetValues,
	defaultThemeValues,
	themePresets,
	themeVariableGroups,
	type ThemeMode,
	type ThemeOverrides,
	type ThemePreset
} from './theme-lab-config';
import {
	applyThemeOverrides,
	buildOverridesCss,
	clearStoredThemeOverrides,
	loadThemeOverrides,
	removeThemeOverrides,
	saveThemeOverrides
} from './theme-lab-utils';

export function ThemeLab() {
	const isDark = useIsDarkTheme();
	const { setTheme } = useTheme();
	const reduceMotion = useReducedMotion();

	const [isOpen, setIsOpen] = useState(false);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [copied, setCopied] = useState(false);
	// Safe as a lazy initialiser because this component is mounted client-only.
	const [overrides, setOverrides] = useState<ThemeOverrides>(() =>
		loadThemeOverrides()
	);

	const panelRef = useRef<HTMLDivElement>(null);
	const mode: ThemeMode = isDark ? 'dark' : 'light';

	// Single source of truth for persistence: `resetAll` only has to empty the
	// state, otherwise this effect would immediately re-save `{}` over the top
	// of a manual clear and leave a stale key behind.
	useEffect(() => {
		const hasOverrides =
			Object.keys(overrides.light).length > 0 ||
			Object.keys(overrides.dark).length > 0;

		if (hasOverrides) {
			applyThemeOverrides(overrides);
			saveThemeOverrides(overrides);
			return;
		}

		removeThemeOverrides();
		clearStoredThemeOverrides();
	}, [overrides]);

	useEffect(() => {
		if (!isOpen) return;

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') setIsOpen(false);
		}

		function onPointerDown(event: PointerEvent) {
			if (!panelRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('pointerdown', onPointerDown);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('pointerdown', onPointerDown);
		};
	}, [isOpen]);

	function setVariable(name: string, value: string) {
		setOverrides((current) => ({
			...current,
			[mode]: { ...current[mode], [name]: value }
		}));
	}

	function applyPreset(preset: ThemePreset) {
		const values = buildPresetValues(preset);

		setOverrides((current) => ({
			light: { ...current.light, ...values.light },
			dark: { ...current.dark, ...values.dark }
		}));
	}

	function resetAll() {
		setOverrides({ light: {}, dark: {} });
	}

	async function copyCss() {
		const css = buildOverridesCss(overrides);
		if (!css) return;

		try {
			await navigator.clipboard.writeText(css);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			// Clipboard can be blocked by permissions; nothing else to do.
		}
	}

	function valueFor(name: string) {
		return overrides[mode][name] ?? defaultThemeValues[mode][name] ?? '';
	}

	const changedCount =
		Object.keys(overrides.light).length +
		Object.keys(overrides.dark).length;

	const visibleGroups = themeVariableGroups.filter(
		(group) => showAdvanced || !group.advanced
	);

	return (
		<div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
			<AnimatePresence>
				{isOpen ? (
					<motion.div
						ref={panelRef}
						role="dialog"
						aria-label="Theme lab"
						initial={
							reduceMotion
								? { opacity: 0 }
								: { opacity: 0, y: 12, scale: 0.96 }
						}
						animate={
							reduceMotion
								? { opacity: 1 }
								: { opacity: 1, y: 0, scale: 1 }
						}
						exit={
							reduceMotion
								? { opacity: 0 }
								: { opacity: 0, y: 12, scale: 0.96 }
						}
						transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
						className="flex max-h-[75vh] w-[21rem] origin-bottom-right flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
					>
						<div className="flex items-center justify-between border-b border-border px-4 py-3">
							<div>
								<p className="font-heading text-sm font-semibold">
									Theme Lab
								</p>
								<p className="font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
									Browser only · {changedCount} changed
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								aria-label="Close theme lab"
								className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<X className="size-4" />
							</button>
						</div>

						<div className="flex items-center gap-1 border-b border-border p-2">
							{(['light', 'dark'] as const).map((option) => (
								<button
									key={option}
									type="button"
									onClick={() => setTheme(option)}
									className={cn(
										'flex-1 rounded-md px-3 py-1.5 font-mono text-xs tracking-wide uppercase transition-colors',
										mode === option
											? 'bg-primary text-primary-foreground dark:text-white'
											: 'text-muted-foreground hover:bg-muted hover:text-foreground'
									)}
								>
									{option}
								</button>
							))}
						</div>

						<div className="min-h-0 flex-1 overflow-y-auto">
							<div className="border-b border-border p-4">
								<p className="font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase">
									Presets
								</p>
								<div className="mt-3 flex flex-wrap gap-2">
									{themePresets.map((preset) => (
										<button
											key={preset.name}
											type="button"
											onClick={() => applyPreset(preset)}
											title={`${preset.name} · ${preset[mode]}`}
											className="size-7 rounded-full border border-border transition-transform hover:scale-110"
											// Swatch shows the value for the mode
											// being edited, so it matches what
											// clicking it will apply.
											style={{ background: preset[mode] }}
										>
											<span className="sr-only">
												{preset.name}
											</span>
										</button>
									))}
								</div>
							</div>

							{visibleGroups.map((group) => (
								<div
									key={group.title}
									className="border-b border-border p-4"
								>
									<p className="font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase">
										{group.title}
									</p>

									<div className="mt-3 flex flex-col gap-2.5">
										{group.variables.map((variable) => {
											const value = valueFor(
												variable.name
											);
											const isOverridden =
												variable.name in
												overrides[mode];

											return (
												<div
													key={variable.name}
													className="flex items-center gap-2"
												>
													<input
														type="color"
														aria-label={`${variable.label} colour`}
														value={cssColorToHex(
															value
														)}
														onChange={(event) =>
															setVariable(
																variable.name,
																event.target
																	.value
															)
														}
														className="size-7 shrink-0 cursor-pointer rounded border border-border bg-transparent"
													/>
													<span
														className={cn(
															'w-28 shrink-0 truncate text-xs',
															isOverridden
																? 'text-primary'
																: 'text-muted-foreground'
														)}
														title={`--${variable.name}`}
													>
														{variable.label}
													</span>
													<input
														type="text"
														aria-label={`${variable.label} value`}
														value={value}
														onChange={(event) =>
															setVariable(
																variable.name,
																event.target
																	.value
															)
														}
														spellCheck={false}
														className="min-w-0 flex-1 rounded border border-input bg-transparent px-2 py-1 font-mono text-[0.7rem] outline-none focus-visible:border-ring"
													/>
												</div>
											);
										})}
									</div>
								</div>
							))}

							<button
								type="button"
								onClick={() => setShowAdvanced((show) => !show)}
								className="w-full px-4 py-3 text-left font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-foreground"
							>
								{showAdvanced ? '− Hide' : '+ Show'} chart &
								sidebar
							</button>
						</div>

						<div className="flex items-center gap-2 border-t border-border p-3">
							<button
								type="button"
								onClick={resetAll}
								className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs transition-colors hover:bg-muted"
							>
								<RotateCcw className="size-3.5" />
								Reset
							</button>
							<button
								type="button"
								onClick={copyCss}
								disabled={changedCount === 0}
								className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 dark:text-white"
							>
								{copied ? (
									<Check className="size-3.5" />
								) : (
									<Copy className="size-3.5" />
								)}
								{copied ? 'Copied' : 'Copy CSS'}
							</button>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>

			<button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				aria-label="Open theme lab"
				aria-expanded={isOpen}
				className="relative inline-flex size-11 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur transition-colors hover:border-primary/50"
			>
				<motion.span
					animate={
						reduceMotion || !isOpen ? { rotate: 0 } : { rotate: 90 }
					}
					transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
					className="flex"
				>
					<Settings2 className="size-5" />
				</motion.span>
				{changedCount > 0 ? (
					<span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary" />
				) : null}
			</button>
		</div>
	);
}
