import type { Theme } from '@core/constants/theme';
import { classNames } from '@core/utils/classNames';
import type { ThemeToggleProps } from '@src-types/ui/theme';

/**
 * ThemeToggle - Component to switch between light, dark, and system themes
 *
 * Cycles through: light → dark → system → light
 * Accessible: keyboard navigable, proper ARIA labels
 *
 * Note: This is a presentational component. Pass theme state from app-level providers.
 */
function getThemeIcon(
	currentTheme: Readonly<Theme>,
	resolvedTheme: Readonly<'light' | 'dark'>
): string {
	if (currentTheme === 'system') {
		return '💻';
	}
	return resolvedTheme === 'dark' ? '🌙' : '☀️';
}

function getThemeLabel(currentTheme: Readonly<Theme>): string {
	if (currentTheme === 'system') {
		return 'System';
	}
	return currentTheme === 'dark' ? 'Dark' : 'Light';
}

function getNextTheme(currentTheme: Readonly<Theme>): Theme {
	if (currentTheme === 'light') {
		return 'dark';
	}

	if (currentTheme === 'dark') {
		return 'system';
	}
	return 'light';
}

export default function ThemeToggle({
	theme: currentTheme,
	resolvedTheme,
	setTheme,
	ariaLabel = 'Toggle theme',
	className,
}: Readonly<ThemeToggleProps>) {
	const handleToggle = (): void => {
		setTheme(getNextTheme(currentTheme));
	};

	const themeLabel = getThemeLabel(currentTheme);
	const themeIcon = getThemeIcon(currentTheme, resolvedTheme);

	return (
		<button
			type="button"
			onClick={handleToggle}
			aria-label={`${ariaLabel}: Current theme is ${themeLabel}`}
			title={`Current theme: ${themeLabel}. Click to toggle.`}
			className={classNames(
				'inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800',
				className
			)}
		>
			<span aria-hidden="true">{themeIcon}</span>
			<span className="sr-only sm:not-sr-only">{themeLabel}</span>
		</button>
	);
}
