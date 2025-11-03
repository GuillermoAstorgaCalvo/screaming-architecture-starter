import { getHelperTextVariantClasses } from '@core/ui/variants/helperText';
import type { HelperTextProps } from '@src-types/ui';

export type { HelperTextProps, StandardSize as HelperTextSize } from '@src-types/ui';

/**
 * HelperText - Reusable helper text component
 *
 * Features:
 * - Accessible: can be associated with form fields via ID
 * - Helper text styling with dark mode support
 * - Size variants: sm, md, lg
 *
 * @example
 * ```tsx
 * <HelperText id="email-helper" size="sm">
 *   We'll never share your email
 * </HelperText>
 * ```
 */
export default function HelperText({
	children,
	id,
	size = 'md',
	className,
	...props
}: Readonly<HelperTextProps>) {
	return (
		<p id={id} className={getHelperTextVariantClasses({ size, className })} {...props}>
			{children}
		</p>
	);
}
