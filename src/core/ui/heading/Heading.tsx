import { getHeadingVariantClasses } from '@core/ui/variants/heading';
import type { HeadingProps } from '@src-types/ui/typography';

/**
 * Heading - Reusable typography heading component (h1-h6)
 *
 * Features:
 * - Accessible: semantic heading elements (h1-h6)
 * - Size variants: sm, md, lg
 * - Dark mode support
 * - Proper heading hierarchy support
 *
 * @example
 * ```tsx
 * <Heading as="h1" size="lg">
 *   Main Page Title
 * </Heading>
 * ```
 *
 * @example
 * ```tsx
 * <Heading as="h2" size="md">
 *   Section Heading
 * </Heading>
 * ```
 */
export default function Heading({
	children,
	as = 'h1',
	size = 'md',
	className,
	...props
}: Readonly<HeadingProps>) {
	const HeadingTag = as;
	return (
		<HeadingTag className={getHeadingVariantClasses({ size, className })} {...props}>
			{children}
		</HeadingTag>
	);
}
