import type { Theme } from '@core/constants/theme';
import { useTranslation } from '@core/i18n/useTranslation';
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

function getThemeLabel(
	currentTheme: Readonly<Theme>,
	t: (key: 'theme.system' | 'theme.dark' | 'theme.light') => string
): string {
	if (currentTheme === 'system') {
		return t('theme.system');
	}
	return currentTheme === 'dark' ? t('theme.dark') : t('theme.light');
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
	ariaLabel,
	className,
}: Readonly<ThemeToggleProps>) {
	const { t } = useTranslation('common');
	const handleToggle = (): void => {
		setTheme(getNextTheme(currentTheme));
	};

	const themeLabel = getThemeLabel(currentTheme, t);
	const themeIcon = getThemeIcon(currentTheme, resolvedTheme);
	const defaultAriaLabel = ariaLabel ?? t('a11y.toggleTheme');
	const ariaLabelText = t('a11y.currentTheme', { theme: themeLabel });
	const titleText = t('a11y.currentThemeDescription', { theme: themeLabel });

	return (
		<button
			type="button"
			onClick={handleToggle}
			aria-label={`${defaultAriaLabel}: ${ariaLabelText}`}
			title={titleText}
			className={classNames(
				'inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-border dark:bg-surface dark:text-text-primary dark:hover:bg-muted dark:focus:ring-offset-surface',
				className
			)}
		>
			<span aria-hidden="true">{themeIcon}</span>
			<span className="sr-only sm:not-sr-only">{themeLabel}</span>
		</button>
	);
}
