import { getErrorTextVariantClasses } from '@core/ui/variants/errorText';
import type { ErrorTextProps } from '@src-types/ui';

export type { ErrorTextProps, StandardSize as ErrorTextSize } from '@src-types/ui';

/**
 * ErrorText - Reusable error message component
 *
 * Features:
 * - Accessible: uses alert role for screen readers
 * - Error styling with dark mode support
 * - Size variants: sm, md, lg
 *
 * @example
 * ```tsx
 * <ErrorText id="email-error" size="sm">
 *   This field is required
 * </ErrorText>
 * ```
 */
export default function ErrorText({
	children,
	id,
	size = 'md',
	className,
	...props
}: Readonly<ErrorTextProps>) {
	return (
		<p id={id} role="alert" className={getErrorTextVariantClasses({ size, className })} {...props}>
			{children}
		</p>
	);
}
