import type { CSSProperties, HTMLAttributes, ReactNode, RefObject, TouchEvent } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Props for the pull-to-refresh container component
 */
export interface PullToRefreshContainerProps {
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
export function PullToRefreshContainer({
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
