import type { SwipeableAction } from '@src-types/ui/overlays/interactions';
import type { CSSProperties } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Props for SwipeableActions component
 */
export interface SwipeableActionsProps {
	actions: readonly SwipeableAction[];
	actionsContainerStyle: CSSProperties;
	onActionClick: (action: SwipeableAction) => Promise<void>;
}

/**
 * Render action buttons for swipeable component
 *
 * @example
 * ```tsx
 * <SwipeableActions
 *   actions={rightActions}
 *   actionsContainerStyle={styles}
 *   onActionClick={handleActionClick}
 * />
 * ```
 */
export function SwipeableActions({
	actions,
	actionsContainerStyle,
	onActionClick,
}: Readonly<SwipeableActionsProps>) {
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
						onClick={() => onActionClick(action)}
					>
						{action.content}
					</button>
				))}
			</div>
		</div>
	);
}
