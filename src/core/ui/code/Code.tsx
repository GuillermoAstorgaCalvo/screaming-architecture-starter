import { getCodeVariantClasses } from '@core/ui/variants/code';
import type { CodeProps } from '@src-types/ui/typography';

/**
 * Code - Inline code component for displaying code snippets within text
 *
 * Features:
 * - Accessible: semantic code element
 * - Size variants: sm, md, lg
 * - Dark mode support
 * - Monospace font for code readability
 *
 * @example
 * ```tsx
 * <Text>
 *   Use the <Code>console.log()</Code> function to debug.
 * </Text>
 * ```
 *
 * @example
 * ```tsx
 * <Code size="sm">npm install</Code>
 * ```
 */
export default function Code({ children, size = 'md', className, ...props }: Readonly<CodeProps>) {
	return (
		<code className={getCodeVariantClasses({ size, className })} {...props}>
			{children}
		</code>
	);
}
