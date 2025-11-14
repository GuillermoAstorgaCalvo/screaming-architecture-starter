import Badge from '@core/ui/data-display/badge/Badge';
import { getDisplayCount } from '@core/ui/feedback/notification-bell/helpers/NotificationBellHelpers';
import type { NotificationBellProps } from '@src-types/ui/navigation/notificationBell';
import { twMerge } from 'tailwind-merge';

interface NotificationBadgeProps {
	readonly count: number;
	readonly maxCount: number;
	readonly badgeVariant: NonNullable<NotificationBellProps['badgeVariant']>;
	readonly animated: boolean;
}

/**
 * NotificationBadge - Badge component displaying notification count
 *
 * Displays the notification count with optional animation.
 * Shows max count with "+" suffix when count exceeds maxCount.
 */
export function NotificationBadge({
	count,
	maxCount,
	badgeVariant,
	animated,
}: NotificationBadgeProps) {
	const displayCount = getDisplayCount(count, maxCount);

	return (
		<span
			className={twMerge(
				'absolute -top-1 -right-1',
				'flex items-center justify-center',
				'min-w-5 h-5 px-1',
				animated && 'animate-pulse'
			)}
		>
			<Badge variant={badgeVariant} size="sm">
				{displayCount}
			</Badge>
		</span>
	);
}
