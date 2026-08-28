'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@workspace/ui/components/button';
import { useIsDarkTheme } from '@workspace/ui/hooks/use-is-dark-theme';

export function ThemeToggle() {
	const { setTheme } = useTheme();
	const isDark = useIsDarkTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
		>
			{isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
		</Button>
	);
}
