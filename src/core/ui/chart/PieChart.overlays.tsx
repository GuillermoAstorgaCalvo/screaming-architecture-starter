import type { ReactElement } from 'react';
import { Legend, Tooltip } from 'recharts';

/**
 * Renders the Tooltip component if enabled
 */
export function renderTooltip(showTooltip: boolean): ReactElement | null {
	if (!showTooltip) {
		return null;
	}

	return (
		<Tooltip
			contentStyle={{
				backgroundColor: 'var(--color-background)',
				border: '1px solid var(--color-border)',
				borderRadius: '0.5rem',
			}}
			labelStyle={{ color: 'var(--color-text-primary)' }}
		/>
	);
}

/**
 * Renders the Legend component if enabled
 */
export function renderLegend(showLegend: boolean): ReactElement | null {
	if (!showLegend) {
		return null;
	}

	return (
		<Legend
			wrapperStyle={{ paddingTop: '1rem' }}
			className="text-sm text-text-primary dark:text-text-primary"
		/>
	);
}
