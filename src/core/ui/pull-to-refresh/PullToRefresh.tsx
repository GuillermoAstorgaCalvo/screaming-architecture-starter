import type { PullToRefreshProps } from '@src-types/ui/overlays';
import type { CSSProperties, HTMLAttributes, ReactNode, RefObject, TouchEvent } from 'react';
import { twMerge } from 'tailwind-merge';

import { getIndicatorStyle } from './PullToRefreshHelpers';
import { createIndicatorNode } from './PullToRefreshIndicators';
import { usePullToRefreshHandlers } from './usePullToRefreshHandlers';

/**
 * Props for the pull-to-refresh container component
 */
interface PullToRefreshContainerProps {
	containerRef: RefObject<HTMLDivElement | null>;
	className?: string | undefined;
	onTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
	onTouchMove: (e: TouchEvent<HTMLDivElement>) => void;
	onTouchEnd: () => void | Promise<void>;
	indicatorStyle: CSSProperties;
	indicator: ReactNode;
	isIdle: boolean;
	pullDistance: number;
	children: ReactNode;
	containerProps: Omit<
		HTMLAttributes<HTMLDivElement>,
		'onTouchStart' | 'onTouchMove' | 'onTouchEnd' | 'className'
	>;
}

/**
 * Renders the pull-to-refresh container with indicator
 */
function PullToRefreshContainer({
	containerRef,
	className,
	onTouchStart,
	onTouchMove,
	onTouchEnd,
	indicatorStyle,
	indicator,
	isIdle,
	pullDistance,
	children,
	containerProps,
}: Readonly<PullToRefreshContainerProps>) {
	return (
		<div
			ref={containerRef}
			className={twMerge('relative overflow-auto', className)}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			{...containerProps}
		>
			<div className="absolute top-0 left-0 right-0 z-10" style={indicatorStyle}>
				{indicator}
			</div>
			<div style={{ paddingTop: isIdle ? '0' : `${pullDistance}px` }}>{children}</div>
		</div>
	);
}

/**
 * Creates indicator style and node for pull-to-refresh
 */
function createIndicator({
	isIdle,
	isRefreshing,
	canRelease,
	pullIndicator,
	releaseIndicator,
	refreshingIndicator,
}: {
	isIdle: boolean;
	isRefreshing: boolean;
	canRelease: boolean;
	pullIndicator?: ReactNode;
	releaseIndicator?: ReactNode;
	refreshingIndicator?: ReactNode;
}) {
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

/**
 * Prepares container props from handlers and indicator state
 */
function prepareContainerProps({
	handlers,
	indicator,
	className,
	containerProps,
}: {
	handlers: ReturnType<typeof usePullToRefreshHandlers>;
	indicator: ReturnType<typeof createIndicator>;
	className?: string | undefined;
	containerProps: Omit<
		HTMLAttributes<HTMLDivElement>,
		'onTouchStart' | 'onTouchMove' | 'onTouchEnd' | 'className'
	>;
}) {
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
