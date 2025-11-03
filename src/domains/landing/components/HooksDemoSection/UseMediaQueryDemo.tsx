import { useMediaQuery } from '@core/hooks/useMediaQuery';

export function UseMediaQueryDemo() {
	const isMobile = useMediaQuery('(max-width: 768px)');
	const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	return (
		<div className="space-y-3">
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">useMediaQuery</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Track media query matches (SSR-safe).
			</p>
			<div className="text-sm space-y-1">
				<p>
					Screen size:{' '}
					<span className="font-semibold">{isMobile ? '📱 Mobile' : '💻 Desktop'}</span> (max-width:
					768px)
				</p>
				<p>
					OS theme preference:{' '}
					<span className="font-semibold">{isDarkMode ? '🌙 Dark' : '☀️ Light'}</span>{' '}
					(prefers-color-scheme)
				</p>
			</div>
			<p className="text-xs text-gray-500 dark:text-gray-500">
				<code>useMediaQuery</code> from <code>@core/hooks/useMediaQuery</code>
			</p>
		</div>
	);
}
