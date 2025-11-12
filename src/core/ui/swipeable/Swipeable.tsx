import type { SwipeableAction, SwipeableProps } from '@src-types/ui/overlays';
import {
	type CSSProperties,
	type HTMLAttributes,
	type ReactNode,
	type RefObject,
	type TouchEvent,
	useRef,
} from 'react';
import { twMerge } from 'tailwind-merge';

import { useSwipeable } from './useSwipeable';

/**
 * Render action buttons
 */
function renderActions(
	actions: readonly SwipeableAction[],
	actionsContainerStyle: CSSProperties,
	handleActionClick: (action: SwipeableAction) => Promise<void>
) {
	if (actions.length === 0) return null;
	return (
		<div className="absolute inset-y-0 flex items-center" style={actionsContainerStyle}>
			<div className="flex h-full w-full items-center">
				{actions.map(action => (
					<button
						key={action.id}
						type="button"
						className={twMerge(
							'flex h-full items-center justify-center px-4 transition-colors focus:outline-none',
							action.background ?? 'bg-secondary'
						)}
						onClick={() => handleActionClick(action)}
					>
						{action.content}
					</button>
				))}
			</div>
		</div>
	);
}

/**
 * Props for SwipeableContainer
 */
interface SwipeableContainerProps {
	containerRef: RefObject<HTMLDivElement | null>;
	className: string | undefined;
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
 * Render swipeable container
 */
function SwipeableContainer({
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
}: SwipeableContainerProps &
	Omit<HTMLAttributes<HTMLDivElement>, 'onTouchStart' | 'onTouchMove' | 'onTouchEnd'>) {
	const actionsElement = showActions
		? renderActions(actions, actionsContainerStyle, handleActionClick)
		: null;
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
			{actionsElement}
			<div className="relative transition-transform duration-200 ease-out" style={contentStyle}>
				{children}
			</div>
		</div>
	);
}

/**
 * Swipeable - Swipeable component for mobile gestures
 *
 * Features:
 * - Multi-directional swipe support (left, right, up, down, horizontal, vertical, all)
 * - Customizable threshold
 * - Action buttons revealed on swipe
 * - Smooth animations
 * - Touch gesture support
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <Swipeable
 *   direction="horizontal"
 *   rightActions={[
 *     { id: 'edit', content: <EditIcon />, background: 'bg-blue-500', onAction: handleEdit },
 *   ]}
 *   leftActions={[
 *     { id: 'delete', content: <DeleteIcon />, background: 'bg-red-500', onAction: handleDelete },
 *   ]}
 * >
 *   <div>Your swipeable content</div>
 * </Swipeable>
 * ```
 */
export default function Swipeable({
	children,
	direction = 'horizontal',
	threshold = 50,
	leftActions = [],
	rightActions = [],
	upActions = [],
	downActions = [],
	onSwipe,
	disabled = false,
	className,
	...props
}: Readonly<SwipeableProps>) {
	const containerRef = useRef<HTMLDivElement>(null);
	const swipeableData = useSwipeable({
		direction,
		threshold,
		leftActions,
		rightActions,
		upActions,
		downActions,
		disabled,
		onSwipe,
	});

	return (
		<SwipeableContainer
			containerRef={containerRef}
			className={className}
			{...swipeableData}
			{...props}
		>
			{children}
		</SwipeableContainer>
	);
}
