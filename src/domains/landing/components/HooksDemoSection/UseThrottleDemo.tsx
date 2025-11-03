import { useThrottle } from '@core/hooks/useThrottle';
import Button from '@core/ui/button/Button';
import { useState } from 'react';

const THROTTLE_DELAY_MS = 500;

export function UseThrottleDemo() {
	const [scrollCount, setScrollCount] = useState(0);
	const throttledCount = useThrottle(scrollCount, THROTTLE_DELAY_MS);

	return (
		<div className="space-y-3">
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">useThrottle</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Throttle value updates to run at most once per delay period.
			</p>
			<div className="flex gap-2 flex-wrap">
				<Button onClick={() => setScrollCount(c => c + 1)} size="sm">
					Increment ({scrollCount})
				</Button>
			</div>
			<div className="text-sm">
				<p>
					Current: <span className="font-mono">{scrollCount}</span>
				</p>
				<p>
					Throttled: <span className="font-mono">{throttledCount}</span>
				</p>
				<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
					{scrollCount === throttledCount ? '✅ Up to date' : '⏳ Throttling...'}
				</p>
			</div>
			<p className="text-xs text-gray-500 dark:text-gray-500">
				<code>useThrottle</code> from <code>@core/hooks/useThrottle</code>
			</p>
		</div>
	);
}
