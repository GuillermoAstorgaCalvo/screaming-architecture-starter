import Badge from '@core/ui/badge/Badge';
import BellIcon from '@core/ui/icons/bell-icon/BellIcon';
import type { StandardSize } from '@src-types/ui/base';
import type { NotificationBellProps } from '@src-types/ui/navigation';
import { twMerge } from 'tailwind-merge';

const ICON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
} as const;

function getIconSizeClasses(size: StandardSize): string {
	return ICON_SIZE_CLASSES[size];
}

function getDisplayCount(count: number, maxCount: number): string {
	return count > maxCount ? `${maxCount}+` : count.toString();
}

interface NotificationBadgeProps {
	readonly count: number;
	readonly maxCount: number;
	readonly badgeVariant: NonNullable<NotificationBellProps['badgeVariant']>;
	readonly animated: boolean;
}

function NotificationBadge({ count, maxCount, badgeVariant, animated }: NotificationBadgeProps) {
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

/**
 * NotificationBell - Notification bell icon with badge indicator
 *
 * Features:
 * - Badge showing notification count
 * - Configurable max count (shows "99+" for counts above max)
 * - Size variants: sm, md, lg
 * - Badge variant options
 * - Optional pulsing animation
 * - Accessible button with aria-label
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <NotificationBell count={5} onClick={handleNotificationsClick} />
 * ```
 *
 * @example
 * ```tsx
 * <NotificationBell
 *   count={150}
 *   maxCount={99}
 *   badgeVariant="error"
 *   animated
 *   size="lg"
 * />
 * ```
 */
function getButtonClasses(animated: boolean, showBadge: boolean, className?: string): string {
	return twMerge(
		'relative inline-flex items-center justify-center',
		'rounded-md transition-colors',
		'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
		'hover:bg-gray-100 dark:hover:bg-gray-800',
		'disabled:opacity-50 disabled:cursor-not-allowed',
		animated && showBadge && 'animate-pulse',
		className
	);
}

export default function NotificationBell({
	count = 0,
	maxCount = 99,
	size = 'md',
	badgeVariant = 'error',
	animated = false,
	disabled = false,
	'aria-label': ariaLabel = 'Notifications',
	className,
	...props
}: Readonly<NotificationBellProps>) {
	const showBadge = count > 0;
	const iconSizeClasses = getIconSizeClasses(size);
	const buttonClasses = getButtonClasses(animated, showBadge, className);

	return (
		<button
			type="button"
			disabled={disabled}
			aria-label={ariaLabel}
			className={buttonClasses}
			{...props}
		>
			<BellIcon size={size} className={iconSizeClasses} />
			{showBadge ? (
				<NotificationBadge
					count={count}
					maxCount={maxCount}
					badgeVariant={badgeVariant}
					animated={animated}
				/>
			) : null}
		</button>
	);
}
