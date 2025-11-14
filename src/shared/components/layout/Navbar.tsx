import { ROUTES } from '@core/config/routes';
import { useTranslation } from '@core/i18n/useTranslation';
import LanguageSelectorFlag from '@core/ui/language-selector/LanguageSelectorFlag';
import ThemeToggle from '@core/ui/theme-toggle/ThemeToggle';
import { classNames } from '@core/utils/classNames';
import type { NavbarProps } from '@src-types/layout';
import { Link } from 'react-router-dom';

/**
 * Navbar - Main navigation component with optional theme toggle and language selector
 *
 * Includes navigation links, language selector, and theme toggle button (if theme prop provided)
 * Domain-agnostic: accepts routes from core/config/routes
 */
export default function Navbar({ theme: themeConfig, className }: Readonly<NavbarProps>) {
	const { t } = useTranslation('common');

	return (
		<nav
			className={classNames(
				'flex items-center justify-between border-b border-border bg-surface px-xl py-lg dark:border-border dark:bg-surface',
				className
			)}
			aria-label={t('a11y.mainNavigation')}
		>
			<div className="flex items-center gap-4">
				<Link
					className="text-lg font-semibold text-primary underline-offset-4 hover:text-primary/90 hover:underline dark:text-primary dark:hover:text-primary/80"
					to={ROUTES.HOME}
				>
					{t('nav.home')}
				</Link>
			</div>
			<div className="flex items-center gap-3">
				<LanguageSelectorFlag size="sm" />
				{themeConfig ? (
					<ThemeToggle
						theme={themeConfig.theme}
						resolvedTheme={themeConfig.resolvedTheme}
						setTheme={themeConfig.setTheme}
					/>
				) : null}
			</div>
		</nav>
	);
}
