/**
 * Default loading fallback component for Loadable
 *
 * Extracted to separate file for Fast Refresh compatibility.
 */

import { ARIA_LABELS, ARIA_LIVE } from '@core/constants/aria';
import type { ReactNode } from 'react';

/** Default loading fallback component */
export function DefaultLoadingFallback(): ReactNode {
	return (
		<div
			className="flex items-center justify-center p-6"
			aria-live={ARIA_LIVE.POLITE}
			aria-label={ARIA_LABELS.LOADING}
		>
			<p className="text-gray-600 dark:text-gray-400">Loading...</p>
		</div>
	);
}
