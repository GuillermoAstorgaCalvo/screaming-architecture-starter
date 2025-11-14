import { BannerContent, BannerIcon } from '@core/ui/feedback/banner/components/BannerComponents';
import {
	BANNER_BASE_CLASSES,
	BANNER_INTENT_STYLES,
} from '@core/ui/feedback/banner/constants/Banner.constants';
import { classNames } from '@core/utils/classNames';
import type { BannerProps } from '@src-types/ui/feedback';

/**
 * Banner - Static banner component for announcements
 *
 * Features:
 * - Static announcements (vs Alert for dynamic notifications)
 * - Intent variants: info, success, warning, error
 * - Optional title and description
 * - Optional action button
 * - Custom icon support
 * - Accessible: proper ARIA roles
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Banner intent="info" title="Maintenance Notice">
 *   Scheduled maintenance will occur on Friday at 2 AM.
 * </Banner>
 * ```
 *
 * @example
 * ```tsx
 * <Banner
 *   intent="success"
 *   title="Feature Available"
 *   description="New dashboard features are now live!"
 *   action={{
 *     label: "Learn More",
 *     onClick: () => navigate('/features'),
 *   }}
 * />
 * ```
 */
export default function Banner({
	intent = 'info',
	title,
	description,
	children,
	icon,
	className,
	action,
	role = 'region',
	...props
}: Readonly<BannerProps>) {
	return (
		<div
			role={role}
			className={classNames(BANNER_BASE_CLASSES, BANNER_INTENT_STYLES[intent], className)}
			{...props}
		>
			<BannerIcon intent={intent} icon={icon} />
			<BannerContent
				{...(title !== undefined && { title })}
				{...(description !== undefined && { description })}
				{...(action !== undefined && { action })}
			>
				{children}
			</BannerContent>
		</div>
	);
}
