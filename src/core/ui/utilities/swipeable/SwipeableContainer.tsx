import { SwipeableActions } from '@core/ui/utilities/swipeable/SwipeableActions';
import type { SwipeableAction } from '@src-types/ui/overlays/interactions';
import type { CSSProperties, HTMLAttributes, ReactNode, RefObject, TouchEvent } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Props for SwipeableContainer component
 */
export interface SwipeableContainerProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onTouchStart' | 'onTouchMove' | 'onTouchEnd'> {
	containerRef: RefObject<HTMLDivElement | null>;
	className?: string | undefined;
	handleTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
	handleTouchMove: (e: TouchEvent<HTMLDivElement>) => void;
	handleTouchEnd: () => void;
	showActions: boolean;
	actions: readonly SwipeableAction[];
	actionsContainerStyle: CSSProperties;
	handleActionClick: (action: SwipeableAction) => Promise<void>;
	contentStyle: CSSProperties;
	children: ReactNode;
}

/**
 * Container component for swipeable content
 *
 * Handles touch events and renders action buttons when swiped.
 *
 * @example
 * ```tsx
 * <SwipeableContainer
 *   containerRef={ref}
 *   handleTouchStart={handleTouchStart}
 *   handleTouchMove={handleTouchMove}
 *   handleTouchEnd={handleTouchEnd}
 *   showActions={showActions}
 *   actions={actions}
 *   actionsContainerStyle={styles}
 *   handleActionClick={handleActionClick}
 *   contentStyle={contentStyle}
 * >
 *   {children}
 * </SwipeableContainer>
 * ```
 */
export function SwipeableContainer({
	containerRef,
	className,
	handleTouchStart,
	handleTouchMove,
	handleTouchEnd,
	showActions,
	actions,
	actionsContainerStyle,
	handleActionClick,
	contentStyle,
	children,
	...props
}: Readonly<SwipeableContainerProps>) {
	const containerClassName = twMerge('relative overflow-hidden', className);

	return (
		<div
			ref={containerRef}
			className={containerClassName}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			{...props}
		>
			{showActions ? (
				<SwipeableActions
					actions={actions}
					actionsContainerStyle={actionsContainerStyle}
					onActionClick={handleActionClick}
				/>
			) : null}
			<div className="relative transition-transform duration-normal ease-out" style={contentStyle}>
				{children}
			</div>
		</div>
	);
}
