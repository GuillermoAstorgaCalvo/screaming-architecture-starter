import { ROUTES } from '@core/config/routes';
import type { Theme } from '@core/constants/theme';
import ThemeToggle from '@shared/components/ui/ThemeToggle';
import { Link } from 'react-router-dom';

export interface NavbarProps {
	/**
	 * Theme configuration for ThemeToggle
	 * If not provided, ThemeToggle will not be rendered
	 */
	readonly theme?:
		| {
				readonly theme: Theme;
				readonly resolvedTheme: 'light' | 'dark';
				/**
				 * Function to set the theme
				 */
				readonly setTheme: (_theme: Theme) => void;
		  }
		| undefined;
	/**
	 * Optional custom className for styling
	 */
	readonly className?: string;
}

/**
 * Navbar - Main navigation component with optional theme toggle
 *
 * Includes navigation links and theme toggle button (if theme prop provided)
 * Domain-agnostic: accepts routes from core/config/routes
 */
export default function Navbar({ theme: themeConfig, className }: NavbarProps) {
	return (
		<nav
			className={`flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900 ${className ?? ''}`}
			aria-label="Main navigation"
		>
			<div className="flex items-center gap-4">
				<Link
					className="text-lg font-semibold text-primary underline-offset-4 hover:text-primary/90 hover:underline dark:text-primary dark:hover:text-primary/80"
					to={ROUTES.HOME}
				>
					Home
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
