import { useFetch } from '@core/hooks/useFetch';
import Button from '@core/ui/button/Button';

export function UseFetchDemo() {
	const {
		data,
		loading,
		error,
		fetch: fetchData,
		reset,
	} = useFetch<{ message: string }>('/api/demo', { autoFetch: false });

	return (
		<div className="space-y-3">
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">useFetch</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Fetch data using the HTTP client with automatic state management.
			</p>
			<div className="flex gap-2 flex-wrap">
				<Button onClick={fetchData} disabled={loading} size="sm">
					{loading ? 'Fetching...' : 'Fetch Data'}
				</Button>
				<Button onClick={reset} variant="secondary" size="sm" disabled={loading}>
					Reset
				</Button>
			</div>
			<div className="text-sm">
				{loading ? <p className="text-blue-600 dark:text-blue-400">⏳ Loading...</p> : null}
				{error ? <p className="text-red-600 dark:text-red-400">❌ Error: {error}</p> : null}
				{data && !loading ? (
					<p className="text-green-600 dark:text-green-400">✅ {JSON.stringify(data)}</p>
				) : null}
			</div>
			<p className="text-xs text-gray-500 dark:text-gray-500">
				<code>useFetch</code> from <code>@core/hooks/useFetch</code>
			</p>
		</div>
	);
}
