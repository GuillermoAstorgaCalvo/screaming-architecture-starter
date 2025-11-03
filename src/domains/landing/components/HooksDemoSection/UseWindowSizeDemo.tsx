import { useWindowSize } from '@core/hooks/useWindowSize';

export function UseWindowSizeDemo() {
	const { width, height } = useWindowSize();

	return (
		<div className="space-y-3">
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">useWindowSize</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Track window dimensions (SSR-safe).
			</p>
			<div className="text-sm">
				<p>
					Window size: <span className="font-mono">{width}</span> ×{' '}
					<span className="font-mono">{height}</span>px
				</p>
				<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
					Resize the window to see updates
				</p>
			</div>
			<p className="text-xs text-gray-500 dark:text-gray-500">
				<code>useWindowSize</code> from <code>@core/hooks/useWindowSize</code>
			</p>
		</div>
	);
}
