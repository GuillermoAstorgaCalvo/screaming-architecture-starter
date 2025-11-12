import {
	STATUS_INDICATOR_BADGE_BASE_CLASSES,
	STATUS_INDICATOR_BADGE_SIZE_CLASSES,
	STATUS_INDICATOR_BADGE_STATUS_CLASSES,
	STATUS_INDICATOR_BASE_CLASSES,
	STATUS_INDICATOR_DOT_SIZE_CLASSES,
	STATUS_INDICATOR_STATUS_CLASSES,
} from '@core/constants/ui/display';
import type { StatusIndicatorProps } from '@src-types/ui/feedback';
import { twMerge } from 'tailwind-merge';

/**
 * StatusIndicator - Small status indicator (dot/badge) for online/offline/busy states
 *
 * Features:
 * - Dot or badge variant
 * - Status variants: online, offline, busy, away
 * - Size variants: sm, md, lg
 * - Optional pulse animation
 * - Optional label text (badge variant)
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <StatusIndicator status="online" />
 * <StatusIndicator status="offline" variant="badge" label="Offline" />
 * <StatusIndicator status="busy" animated />
 * ```
 */
export default function StatusIndicator({
	status = 'online',
	variant = 'dot',
	size = 'md',
	label,
	animated = false,
	className,
	...props
}: Readonly<StatusIndicatorProps>) {
	if (variant === 'badge') {
		const badgeClasses = twMerge(
			STATUS_INDICATOR_BASE_CLASSES,
			STATUS_INDICATOR_BADGE_BASE_CLASSES,
			STATUS_INDICATOR_BADGE_SIZE_CLASSES[size],
			STATUS_INDICATOR_BADGE_STATUS_CLASSES[status],
			className
		);

		const dotClasses = twMerge(
			'rounded-full',
			STATUS_INDICATOR_DOT_SIZE_CLASSES[size],
			STATUS_INDICATOR_STATUS_CLASSES[status],
			animated && 'animate-pulse'
		);

		return (
			<span className={badgeClasses} {...props}>
				<span className={dotClasses} aria-hidden="true" />
				{label ? <span>{label}</span> : null}
			</span>
		);
	}

	// Dot variant
	const dotClasses = twMerge(
		STATUS_INDICATOR_BASE_CLASSES,
		'rounded-full',
		STATUS_INDICATOR_DOT_SIZE_CLASSES[size],
		STATUS_INDICATOR_STATUS_CLASSES[status],
		animated && 'animate-pulse',
		className
	);

	return <span className={dotClasses} aria-label={`Status: ${status}`} {...props} />;
}
