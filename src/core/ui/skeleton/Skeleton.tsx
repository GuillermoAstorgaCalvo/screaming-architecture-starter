import { getSkeletonVariantClasses } from '@core/ui/variants/skeleton';
import type { SkeletonProps } from '@src-types/ui/feedback';

/**
 * Skeleton - Loading state component with animated pulse effect
 *
 * Features:
 * - Animated pulse effect
 * - Multiple variants: text, circular, rectangular
 * - Customizable width and height
 * - Dark mode support
 * - Accessible (aria-hidden by default)
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" className="w-full" />
 * <Skeleton variant="circular" className="w-12 h-12" />
 * <Skeleton variant="rectangular" className="w-full h-32" />
 * ```
 */
export default function Skeleton({
	variant = 'rectangular',
	className,
	...props
}: Readonly<SkeletonProps>) {
	const classes = getSkeletonVariantClasses({ variant, className });
	return <div className={classes} aria-hidden="true" {...props} />;
}
