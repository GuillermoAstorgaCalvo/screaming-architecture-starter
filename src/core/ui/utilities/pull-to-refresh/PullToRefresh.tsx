import { PullToRefreshContainer } from '@core/ui/utilities/pull-to-refresh/components/PullToRefreshContainer';
import { usePullToRefreshHandlers } from '@core/ui/utilities/pull-to-refresh/hooks/usePullToRefreshHandlers';
import { createIndicator } from '@core/ui/utilities/pull-to-refresh/utils/createIndicator';
import { prepareContainerProps } from '@core/ui/utilities/pull-to-refresh/utils/prepareContainerProps';
import type { PullToRefreshProps } from '@src-types/ui/overlays/interactions';

/**
 * PullToRefresh - Pull-to-refresh for mobile
 *
 * Features:
 * - Touch gesture support
 * - Visual feedback during pull
 * - Customizable threshold
 * - Custom indicators for different states
 * - Disabled state support
 * - Smooth animations
 *
 * @example
 * ```tsx
 * <PullToRefresh onRefresh={handleRefresh}>
 *   <div>Your content here</div>
 * </PullToRefresh>
 * ```
 */
export default function PullToRefresh({
	children,
	onRefresh,
	disabled = false,
	threshold = 80,
	pullIndicator,
	releaseIndicator,
	refreshingIndicator,
	className,
	...props
}: Readonly<PullToRefreshProps>) {
	const handlers = usePullToRefreshHandlers({ disabled, threshold, onRefresh });
	const indicator = createIndicator({
		isIdle: handlers.isIdle,
		isRefreshing: handlers.isRefreshing,
		canRelease: handlers.canRelease,
		pullIndicator,
		releaseIndicator,
		refreshingIndicator,
	});

	const containerProps = prepareContainerProps({
		handlers,
		indicator,
		className,
		containerProps: props,
	});

	return <PullToRefreshContainer {...containerProps}>{children}</PullToRefreshContainer>;
}
