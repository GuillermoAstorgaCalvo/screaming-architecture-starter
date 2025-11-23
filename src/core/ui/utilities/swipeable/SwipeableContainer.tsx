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
 * Gets the container className with merged styles
 */
function getContainerClassName(className?: string | undefined): string {
	return twMerge('relative overflow-hidden', className);
}

/**
 * Props for rendering swipeable actions
 */
interface RenderActionsProps {
	showActions: boolean;
	actions: readonly SwipeableAction[];
	actionsContainerStyle: CSSProperties;
	handleActionClick: (action: SwipeableAction) => Promise<void>;
}

/**
 * Renders the swipeable actions if they should be shown
 */
function renderActions({
	showActions,
	actions,
	actionsContainerStyle,
	handleActionClick,
}: Readonly<RenderActionsProps>) {
	if (!showActions) {
		return null;
	}

	return (
		<SwipeableActions
			actions={actions}
			actionsContainerStyle={actionsContainerStyle}
			onActionClick={handleActionClick}
		/>
	);
}

/**
 * Renders the swipeable content wrapper
 */
function renderContent(contentStyle: CSSProperties, children: ReactNode) {
	return (
		<div
			className="relative transition-transform duration-normal ease-out"
			style={contentStyle}
			data-testid="swipeable-content"
		>
			{children}
		</div>
	);
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
	const containerClassName = getContainerClassName(className);

	return (
		<div
			ref={containerRef}
			className={containerClassName}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			{...props}
		>
			{renderActions({ showActions, actions, actionsContainerStyle, handleActionClick })}
			{renderContent(contentStyle, children)}
		</div>
	);
}
