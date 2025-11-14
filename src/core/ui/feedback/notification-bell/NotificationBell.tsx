import { useTranslation } from '@core/i18n/useTranslation';
import BellIcon from '@core/ui/icons/bell-icon/BellIcon';
import type { NotificationBellProps } from '@src-types/ui/navigation/notificationBell';

import { NotificationBadge } from './components/NotificationBadge';
import { getButtonClasses, getIconSizeClasses } from './helpers/NotificationBellHelpers';

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

export default function NotificationBell({
	count = 0,
	maxCount = 99,
	size = 'md',
	badgeVariant = 'error',
	animated = false,
	disabled = false,
	'aria-label': ariaLabel,
	className,
	...props
}: Readonly<NotificationBellProps>) {
	const { t } = useTranslation('common');
	const defaultAriaLabel = ariaLabel ?? t('a11y.notifications');
	const showBadge = count > 0;
	const iconSizeClasses = getIconSizeClasses(size);
	const buttonClasses = getButtonClasses(animated, showBadge, className);

	return (
		<button
			type="button"
			disabled={disabled}
			aria-label={defaultAriaLabel}
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
