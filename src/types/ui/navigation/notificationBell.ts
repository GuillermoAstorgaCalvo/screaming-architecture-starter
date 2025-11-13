import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes } from 'react';

/**
 * NotificationBell component props
 */
export interface NotificationBellProps extends HTMLAttributes<HTMLButtonElement> {
	/** Number of notifications to display (0 hides the badge) */
	count?: number;
	/** Maximum number to display before showing "+" (e.g., 99+) @default 99 */
	maxCount?: number;
	/** Size of the bell icon @default 'md' */
	size?: StandardSize;
	/** Variant of the badge @default 'error' */
	badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
	/** Whether to show a pulsing animation when there are notifications @default false */
	animated?: boolean;
	/** Whether the button is disabled @default false */
	disabled?: boolean;
	/** Accessible label for the notification bell @default 'Notifications' */
	'aria-label'?: string;
}
