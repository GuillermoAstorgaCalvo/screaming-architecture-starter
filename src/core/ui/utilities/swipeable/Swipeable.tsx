import { useSwipeable } from '@core/ui/utilities/swipeable/hooks/useSwipeable';
import { SwipeableContainer } from '@core/ui/utilities/swipeable/SwipeableContainer';
import type { SwipeableProps } from '@src-types/ui/overlays/interactions';
import { useRef } from 'react';

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
 *     { id: 'edit', content: <EditIcon />, background: 'bg-primary', onAction: handleEdit },
 *   ]}
 *   leftActions={[
 *     { id: 'delete', content: <DeleteIcon />, background: 'bg-destructive', onAction: handleDelete },
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
