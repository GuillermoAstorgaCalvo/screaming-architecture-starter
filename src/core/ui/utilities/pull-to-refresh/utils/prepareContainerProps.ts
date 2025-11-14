import type { PullToRefreshContainerProps } from '@core/ui/utilities/pull-to-refresh/components/PullToRefreshContainer';
import type { UsePullToRefreshHandlersReturn } from '@core/ui/utilities/pull-to-refresh/hooks/usePullToRefreshHandlers';
import type { CreateIndicatorResult } from '@core/ui/utilities/pull-to-refresh/utils/createIndicator';
import type { HTMLAttributes } from 'react';

/**
 * Options for preparing container props
 */
export interface PrepareContainerPropsOptions {
	handlers: UsePullToRefreshHandlersReturn;
	indicator: CreateIndicatorResult;
	className?: string | undefined;
	containerProps: Omit<
		HTMLAttributes<HTMLDivElement>,
		'onTouchStart' | 'onTouchMove' | 'onTouchEnd' | 'className'
	>;
}

/**
 * Prepares container props from handlers and indicator state
 */
export function prepareContainerProps({
	handlers,
	indicator,
	className,
	containerProps,
}: PrepareContainerPropsOptions): Omit<PullToRefreshContainerProps, 'children'> {
	return {
		containerRef: handlers.containerRef,
		className,
		onTouchStart: handlers.handleTouchStart,
		onTouchMove: handlers.handleTouchMove,
		onTouchEnd: handlers.handleTouchEnd,
		indicatorStyle: indicator.style,
		indicator: indicator.node,
		isIdle: handlers.isIdle,
		pullDistance: handlers.pullDistance,
		containerProps,
	};
}
