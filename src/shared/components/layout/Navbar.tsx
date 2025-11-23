import { ROUTES } from '@core/config/routes';
import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import { useTranslation } from '@core/i18n/useTranslation';
import Link from '@core/ui/navigation/link/Link';
import { classNames } from '@core/utils/classNames';
import type { NavbarProps } from '@src-types/layout';
import { lazy, Suspense } from 'react';

const LanguageSelectorFlagLazy = lazy(
	() => import('@core/ui/language-selector/LanguageSelectorFlag')
);
const ThemeToggleLazy = lazy(() => import('@core/ui/theme-toggle/ThemeToggle'));

const NAVBAR_BASE_CLASSES = [
	'sticky top-0 z-50 flex items-center justify-between',
	'glass-sm backdrop-blur-xl',
	'border-b border-white/10 dark:border-white/5',
	'px-xl py-lg',
	'bg-surface/80 dark:bg-surface-dark/80',
	'shadow-sm dark:shadow-md',
	'transition-all duration-normal ease-in-out',
].join(' ');

const HOME_BUTTON_CLASSES = [
	'inline-flex items-center justify-center',
	'px-xl py-md rounded-lg',
	'font-bold tracking-tight text-white',
	'btn-gradient',
	'hover:shadow-lg hover:shadow-primary/50 hover:scale-105',
	'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
	'transition-all duration-normal ease-in-out',
	'no-underline',
].join(' ');

/**
 * Navbar - Main navigation component with optional theme toggle and language selector
 *
 * Includes navigation links, language selector, and theme toggle button (if theme prop provided)
 * Domain-agnostic: accepts routes from core/config/routes
 *
 * Features:
 * - Modern glassmorphism design with backdrop blur
 * - Smooth transitions and hover effects
 * - Responsive layout
 * - Accessible navigation
 */
export default function Navbar({ theme: themeConfig, className }: Readonly<NavbarProps>) {
	const { t } = useTranslation('common');
	const showControls = useDeferredActivation({ timeout: 1200 });

	return (
		<nav
			className={classNames(NAVBAR_BASE_CLASSES, className)}
			aria-label={t('a11y.mainNavigation')}
		>
			<div className="flex items-center gap-md">
				<Link to={ROUTES.HOME} variant="default" size="lg" className={HOME_BUTTON_CLASSES}>
					{t('nav.home')}
				</Link>
			</div>
			<div className="flex items-center gap-md">
				{showControls ? (
					<Suspense fallback={null}>
						<div className="flex items-center gap-md rounded-lg bg-muted/30 px-md py-xs backdrop-blur-sm dark:bg-muted-dark/30">
							<LanguageSelectorFlagLazy size="sm" />
							{themeConfig ? (
								<>
									<div className="h-6 w-px bg-border dark:bg-border-dark" aria-hidden="true" />
									<ThemeToggleLazy
										theme={themeConfig.theme}
										resolvedTheme={themeConfig.resolvedTheme}
										setTheme={themeConfig.setTheme}
									/>
								</>
							) : null}
						</div>
					</Suspense>
				) : null}
			</div>
		</nav>
	);
}
