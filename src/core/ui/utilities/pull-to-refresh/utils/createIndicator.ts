import { createIndicatorNode } from '@core/ui/utilities/pull-to-refresh/components/PullToRefreshIndicators';
import { getIndicatorStyle } from '@core/ui/utilities/pull-to-refresh/helpers/PullToRefreshHelpers';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Options for creating an indicator
 */
export interface CreateIndicatorOptions {
	isIdle: boolean;
	isRefreshing: boolean;
	canRelease: boolean;
	pullIndicator?: ReactNode;
	releaseIndicator?: ReactNode;
	refreshingIndicator?: ReactNode;
}

/**
 * Result of creating an indicator
 */
export interface CreateIndicatorResult {
	style: CSSProperties;
	node: ReactNode;
}

/**
 * Creates indicator style and node for pull-to-refresh
 */
export function createIndicator({
	isIdle,
	isRefreshing,
	canRelease,
	pullIndicator,
	releaseIndicator,
	refreshingIndicator,
}: CreateIndicatorOptions): CreateIndicatorResult {
	return {
		style: getIndicatorStyle(isIdle),
		node: createIndicatorNode({
			isRefreshing,
			canRelease,
			pullIndicator,
			releaseIndicator,
			refreshingIndicator,
		}),
	};
}
