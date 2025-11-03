import Spinner from '@core/ui/spinner/Spinner';
import { getButtonVariantClasses } from '@core/ui/variants/button';
import type { ButtonProps } from '@src-types/ui';

export type { ButtonProps, StandardSize as ButtonSize, ButtonVariant } from '@src-types/ui';

/**
 * Button - Reusable button component with variants and sizes
 *
 * Features:
 * - Accessible: proper semantic HTML, keyboard navigation, focus states
 * - Variants: primary, secondary, ghost
 * - Sizes: sm, md, lg
 * - Loading state support
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button variant="primary" isLoading fullWidth>
 *   Submit
 * </Button>
 * ```
 */
export default function Button({
	variant = 'primary',
	size = 'md',
	isLoading = false,
	fullWidth = false,
	disabled,
	className,
	children,
	...props
}: Readonly<ButtonProps>) {
	return (
		<button
			type={props.type ?? 'button'}
			disabled={(disabled ?? false) || isLoading}
			className={getButtonVariantClasses({ variant, size, fullWidth, className })}
			{...props}
		>
			{isLoading ? <Spinner size="sm" className="mr-2" /> : null}
			{children}
		</button>
	);
}
