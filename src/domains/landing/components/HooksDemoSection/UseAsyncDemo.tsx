import { useAsync } from '@core/hooks/useAsync';
import Button from '@core/ui/button/Button';

export function UseAsyncDemo() {
	const fetchRandomNumber = async (): Promise<number> => {
		// Simulate API call
		await new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
		return Math.floor(Math.random() * 100);
	};

	const { data, loading, error, execute, reset } = useAsync(fetchRandomNumber);

	return (
		<div className="space-y-3">
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">useAsync</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Execute async functions with loading and error state management.
			</p>
			<div className="flex gap-2 flex-wrap">
				<Button onClick={execute} disabled={loading} size="sm">
					{loading ? 'Loading...' : 'Fetch Random Number'}
				</Button>
				<Button onClick={reset} variant="secondary" size="sm" disabled={loading}>
					Reset
				</Button>
			</div>
			<div className="text-sm">
				{loading ? <p className="text-blue-600 dark:text-blue-400">⏳ Loading...</p> : null}
				{error ? <p className="text-red-600 dark:text-red-400">❌ Error: {error.message}</p> : null}
				{data !== null && !loading ? (
					<p className="text-green-600 dark:text-green-400">✅ Result: {data}</p>
				) : null}
			</div>
			<p className="text-xs text-gray-500 dark:text-gray-500">
				<code>useAsync</code> from <code>@core/hooks/useAsync</code>
			</p>
		</div>
	);
}
