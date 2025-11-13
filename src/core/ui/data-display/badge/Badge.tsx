import { getBadgeVariantClasses } from '@core/ui/variants/badge';
import type { BadgeProps } from '@src-types/ui/feedback';

/**
 * Badge - Status/label display component
 *
 * Features:
 * - Multiple variants: default, primary, success, warning, error, info
 * - Size variants: sm, md, lg
 * - Dark mode support
 * - Accessible focus states
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="sm">Error</Badge>
 * <Badge variant="primary">New</Badge>
 * ```
 */
export default function Badge({
	variant = 'default',
	size = 'md',
	className,
	children,
	...props
}: Readonly<BadgeProps>) {
	const classes = getBadgeVariantClasses({ variant, size, className });
	return (
		<span className={classes} {...props}>
			{children}
		</span>
	);
}
