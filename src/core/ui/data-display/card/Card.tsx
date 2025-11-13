import { getCardVariantClasses } from '@core/ui/variants/card';
import type { CardProps } from '@src-types/ui/layout/card';

/**
 * Card - Container component for grouping content
 *
 * Features:
 * - Multiple variants: elevated, outlined, flat
 * - Padding size variants: sm, md, lg
 * - Dark mode support
 * - Accessible semantic HTML
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="md">
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * <Card variant="outlined" padding="lg">
 *   <div>More spacious card</div>
 * </Card>
 * ```
 */
export default function Card({
	variant = 'elevated',
	padding = 'md',
	className,
	children,
	...props
}: Readonly<CardProps>) {
	const classes = getCardVariantClasses({ variant, padding, className });
	return (
		<div className={classes} {...props}>
			{children}
		</div>
	);
}
