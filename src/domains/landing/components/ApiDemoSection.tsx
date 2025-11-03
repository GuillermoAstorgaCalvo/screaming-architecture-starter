import { useHttp } from '@core/providers/useHttp';
import { useLogger } from '@core/providers/useLogger';
import { useCallback, useEffect, useState } from 'react';

interface ApiResponse {
	slideshow: {
		author: string;
		date: string;
		slides: Array<{
			title: string;
			type: string;
			items?: string[];
		}>;
		title: string;
	};
}

const SUCCESS_STATUS_MIN = 200;
const SUCCESS_STATUS_MAX = 299;

function useApiFetch() {
	const logger = useLogger();
	const http = useHttp();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<ApiResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const response = await http.get<ApiResponse>('https://httpbin.org/json', {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status >= SUCCESS_STATUS_MIN && response.status <= SUCCESS_STATUS_MAX) {
				setData(response.data);
				logger.info('API demo: Successfully fetched data', { data: response.data });
			} else {
				setError(`Request failed with status ${response.status}`);
				logger.warn('API demo: Request failed', { status: response.status });
			}
		} catch (error_) {
			const errorMessage = error_ instanceof Error ? error_.message : 'Unknown error';
			setError(errorMessage);
			logger.error('API demo: Error fetching data', error_);
		} finally {
			setLoading(false);
		}
	}, [logger, http]);

	useEffect(() => {
		fetchData().catch(() => {
			// Error already handled in fetchData
		});
	}, [fetchData]);

	return { loading, data, error, fetchData };
}

interface ApiDemoContentProps {
	readonly loading: boolean;
	readonly data: ApiResponse | null;
	readonly error: string | null;
	readonly fetchData: () => Promise<void>;
}

function ApiDemoContent({ loading, data, error, fetchData }: ApiDemoContentProps) {
	return (
		<div className="space-y-4">
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Demonstrates{' '}
				<code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">useHttp</code> hook from{' '}
				<code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
					@core/providers/useHttp
				</code>
			</p>

			<button
				type="button"
				onClick={() => {
					fetchData().catch(() => {
						// Error already handled in fetchData
					});
				}}
				disabled={loading}
				className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Loading...' : 'Fetch Data'}
			</button>

			{error !== null && (
				<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
					<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
				</div>
			)}

			{data !== null && (
				<div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
					<p className="text-sm text-green-700 dark:text-green-300">
						Success! Response: {JSON.stringify(data, null, 2)}
					</p>
				</div>
			)}
		</div>
	);
}

export default function ApiDemoSection() {
	const { loading, data, error, fetchData } = useApiFetch();

	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
				HTTP Client Demo
			</h2>
			<ApiDemoContent loading={loading} data={data} error={error} fetchData={fetchData} />
		</section>
	);
}
