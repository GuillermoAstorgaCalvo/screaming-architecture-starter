import { useDebounce } from '@core/hooks/useDebounce';
import { useLogger } from '@core/providers/useLogger';
import { useEffect, useState } from 'react';

const DEBOUNCE_DELAY_MS = 500;

interface SearchInputProps {
	readonly searchTerm: string;

	readonly onSearchChange: (_: string) => void;
}

function SearchInput({ searchTerm, onSearchChange }: SearchInputProps) {
	return (
		<div>
			<label
				htmlFor="search-input"
				className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
			>
				Search (debounced by {DEBOUNCE_DELAY_MS}ms):
			</label>
			<input
				id="search-input"
				type="text"
				value={searchTerm}
				onChange={e => onSearchChange(e.target.value)}
				placeholder="Type to search..."
				className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
			/>
		</div>
	);
}

interface SearchStatusProps {
	readonly searchTerm: string;
	readonly debouncedSearch: string;
}

function SearchStatus({ searchTerm, debouncedSearch }: SearchStatusProps) {
	if (!searchTerm) {
		return null;
	}

	const isPending = searchTerm !== debouncedSearch;

	return (
		<div className="text-sm text-gray-600 dark:text-gray-400">
			<p>
				Current input: <span className="font-mono">{searchTerm}</span>
			</p>
			<p>
				Debounced value: <span className="font-mono">{debouncedSearch || '(empty)'}</span>
			</p>
			<p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
				{isPending ? '⏳ Waiting for debounce...' : '✅ Debounced'}
			</p>
		</div>
	);
}

export default function SearchSection() {
	const logger = useLogger();
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearch = useDebounce(searchTerm, DEBOUNCE_DELAY_MS);

	useEffect(() => {
		if (debouncedSearch) {
			logger.info('Search demo: Debounced search term', { term: debouncedSearch });
			// In a real app, this would trigger an API call or filter results
		}
	}, [debouncedSearch, logger]);

	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
				Debounce Hook Demo
			</h2>
			<div className="space-y-4">
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Demonstrates{' '}
					<code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">useDebounce</code>{' '}
					from{' '}
					<code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
						@core/hooks/useDebounce
					</code>
				</p>

				<SearchInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />
				<SearchStatus searchTerm={searchTerm} debouncedSearch={debouncedSearch} />
			</div>
		</section>
	);
}
