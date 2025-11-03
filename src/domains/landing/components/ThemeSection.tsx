import type { Theme } from '@core/constants/theme';
import ThemeToggle from '@shared/components/ui/ThemeToggle';

export interface ThemeSectionProps {
	readonly theme: Theme;
	readonly resolvedTheme: 'light' | 'dark';
	/**
	 * Function to set the theme preference
	 * @param theme - The new theme value ('light' | 'dark' | 'system')
	 */
	readonly setTheme: (_theme: Theme) => void;
}

export default function ThemeSection({ theme, resolvedTheme, setTheme }: ThemeSectionProps) {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
				Theme Integration
			</h2>
			<div className="space-y-3">
				<div className="flex items-center gap-4">
					<span className="text-sm text-gray-600 dark:text-gray-400">Current theme:</span>
					<span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{theme}</span>
				</div>
				<div className="flex items-center gap-4">
					<span className="text-sm text-gray-600 dark:text-gray-400">Resolved theme:</span>
					<span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
						{resolvedTheme}
					</span>
				</div>
				<div className="flex items-center gap-4">
					<span className="text-sm text-gray-600 dark:text-gray-400">Theme toggle:</span>
					<ThemeToggle theme={theme} resolvedTheme={resolvedTheme} setTheme={setTheme} />
				</div>
			</div>
		</section>
	);
}
