import { getTextVariantClasses } from '@core/ui/variants/text';
import type { TextProps } from '@src-types/ui/typography';

/**
 * Text - Reusable typography paragraph component
 *
 * Features:
 * - Accessible: semantic paragraph element
 * - Size variants: sm, md, lg
 * - Dark mode support
 * - Proper line height for readability
 *
 * @example
 * ```tsx
 * <Text size="md">
 *   This is a paragraph of text with proper typography styling.
 * </Text>
 * ```
 *
 * @example
 * ```tsx
 * <Text size="lg" className="text-primary">
 *   Custom styled text
 * </Text>
 * ```
 */
export default function Text({ children, size = 'md', className, ...props }: Readonly<TextProps>) {
	return (
		<p className={getTextVariantClasses({ size, className })} {...props}>
			{children}
		</p>
	);
}
