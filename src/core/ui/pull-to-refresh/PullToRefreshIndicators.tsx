import Spinner from '@core/ui/spinner/Spinner';
import type { ReactNode } from 'react';

import { INDICATOR_BASE_CLASSES } from './PullToRefreshHelpers';

/**
 * Indicator renderer props
 */
export interface IndicatorProps {
	isRefreshing: boolean;
	canRelease: boolean;
	pullIndicator?: ReactNode;
	releaseIndicator?: ReactNode;
	refreshingIndicator?: ReactNode;
}

/**
 * Renders the appropriate indicator based on the current state
 */
export function renderIndicator({
	isRefreshing,
	canRelease,
	pullIndicator,
	releaseIndicator,
	refreshingIndicator,
}: IndicatorProps) {
	if (isRefreshing) {
		return (
			refreshingIndicator ?? (
				<div className={INDICATOR_BASE_CLASSES}>
					<Spinner size="sm" />
				</div>
			)
		);
	}

	if (canRelease) {
		return (
			releaseIndicator ?? (
				<div className={INDICATOR_BASE_CLASSES}>
					<span className="text-sm">Release to refresh</span>
				</div>
			)
		);
	}

	return (
		pullIndicator ?? (
			<div className={INDICATOR_BASE_CLASSES}>
				<span className="text-sm">Pull to refresh</span>
			</div>
		)
	);
}

/**
 * Creates indicator props for rendering
 */
export function createIndicatorProps({
	isRefreshing,
	canRelease,
	pullIndicator,
	releaseIndicator,
	refreshingIndicator,
}: {
	isRefreshing: boolean;
	canRelease: boolean;
	pullIndicator?: ReactNode;
	releaseIndicator?: ReactNode;
	refreshingIndicator?: ReactNode;
}): IndicatorProps {
	return {
		isRefreshing,
		canRelease,
		pullIndicator,
		releaseIndicator,
		refreshingIndicator,
	};
}

/**
 * Creates indicator node from props
 */
export function createIndicatorNode({
	isRefreshing,
	canRelease,
	pullIndicator,
	releaseIndicator,
	refreshingIndicator,
}: {
	isRefreshing: boolean;
	canRelease: boolean;
	pullIndicator?: ReactNode;
	releaseIndicator?: ReactNode;
	refreshingIndicator?: ReactNode;
}): ReactNode {
	const indicatorProps = createIndicatorProps({
		isRefreshing,
		canRelease,
		pullIndicator,
		releaseIndicator,
		refreshingIndicator,
	});
	return renderIndicator(indicatorProps);
}
