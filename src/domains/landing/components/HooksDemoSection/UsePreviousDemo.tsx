import { usePrevious } from '@core/hooks/usePrevious';
import Button from '@core/ui/button/Button';
import { useState } from 'react';

export function UsePreviousDemo() {
	const [count, setCount] = useState(0);
	const previousCount = usePrevious(count);

	return (
		<div className="space-y-3">
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">usePrevious</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Track the previous value of state or props.
			</p>
			<div className="flex gap-2 flex-wrap items-center">
				<Button onClick={() => setCount(c => c + 1)} size="sm">
					Increment
				</Button>
				<Button onClick={() => setCount(c => c - 1)} variant="secondary" size="sm">
					Decrement
				</Button>
			</div>
			<div className="text-sm">
				<p>
					Current: <span className="font-mono">{count}</span>
				</p>
				<p>
					Previous: <span className="font-mono">{previousCount ?? '(none)'}</span>
				</p>
				{previousCount !== undefined && previousCount !== count && (
					<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
						Changed from {previousCount} to {count}
					</p>
				)}
			</div>
			<p className="text-xs text-gray-500 dark:text-gray-500">
				<code>usePrevious</code> from <code>@core/hooks/usePrevious</code>
			</p>
		</div>
	);
}
