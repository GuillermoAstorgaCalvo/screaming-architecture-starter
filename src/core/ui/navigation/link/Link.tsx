import { getLinkVariantClasses } from '@core/ui/variants/link';
import type { LinkProps } from '@src-types/ui/navigation/link';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Link - Styled navigation link component wrapping react-router-dom Link
 *
 * Features:
 * - Multiple variants: default, subtle, muted
 * - Size variants: sm, md, lg
 * - Dark mode support
 * - Accessible focus states
 * - Proper underline and hover effects
 *
 * @example
 * ```tsx
 * <Link to="/home" variant="default" size="md">
 *   Go to Home
 * </Link>
 * ```
 *
 * @example
 * ```tsx
 * <Link to="/about" variant="subtle" size="sm">
 *   About Us
 * </Link>
 * ```
 */
export default function Link({
	variant = 'default',
	size = 'md',
	className,
	children,
	to,
	showExternalIcon: _showExternalIcon,
	...props
}: Readonly<LinkProps>) {
	const classes = getLinkVariantClasses({ variant, size, className });
	// Filter out showExternalIcon as it's not a valid DOM attribute
	// TODO: Implement external icon rendering if needed
	return (
		<RouterLink to={to} className={classes} {...props}>
			{children}
		</RouterLink>
	);
}
