import { ROUTES } from '@core/config/routes';
import { useTranslation } from '@core/i18n/useTranslation';
import ThemeToggle from '@core/ui/theme-toggle/ThemeToggle';
import { classNames } from '@core/utils/classNames';
import type { NavbarProps } from '@src-types/layout';
import { Link } from 'react-router-dom';

/**
 * Navbar - Main navigation component with optional theme toggle
 *
 * Includes navigation links and theme toggle button (if theme prop provided)
 * Domain-agnostic: accepts routes from core/config/routes
 */
export default function Navbar({ theme: themeConfig, className }: Readonly<NavbarProps>) {
	const { t } = useTranslation('common');

	return (
		<nav
			className={classNames(
				'flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900',
				className
			)}
			aria-label="Main navigation"
		>
			<div className="flex items-center gap-4">
				<Link
					className="text-lg font-semibold text-primary underline-offset-4 hover:text-primary/90 hover:underline dark:text-primary dark:hover:text-primary/80"
					to={ROUTES.HOME}
				>
					{t('nav.home')}
				</Link>
			</div>
			{themeConfig ? (
				<ThemeToggle
					theme={themeConfig.theme}
					resolvedTheme={themeConfig.resolvedTheme}
					setTheme={themeConfig.setTheme}
				/>
			) : null}
		</nav>
	);
}
