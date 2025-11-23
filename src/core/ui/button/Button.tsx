import Spinner from '@core/ui/spinner/Spinner';
import { getButtonVariantClasses } from '@core/ui/variants/button';
import type { ButtonProps } from '@src-types/ui/buttons';
import type { MouseEvent } from 'react';

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
	onClick,
	...props
}: Readonly<ButtonProps>) {
	const isDisabled = (disabled ?? false) || isLoading;

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		// Prevent onClick when button is disabled (handles cases where fireEvent bypasses native disabled)
		if (isDisabled || event.currentTarget.disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		onClick?.(event);
	};

	// Use no-op handler when disabled to ensure onClick is never called
	const clickHandler = isDisabled
		? (event: MouseEvent<HTMLButtonElement>) => {
				event.preventDefault();
				event.stopPropagation();
			}
		: handleClick;

	const { type, ...restProps } = props;

	return (
		<button
			type={type ?? 'button'}
			disabled={isDisabled}
			className={getButtonVariantClasses({ variant, size, fullWidth, className })}
			onClick={clickHandler}
			{...restProps}
		>
			{isLoading ? <Spinner size="sm" className="mr-2" /> : null}
			{children}
		</button>
	);
}
