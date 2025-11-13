import { getToggleVariantClasses } from '@core/ui/variants/toggle';
import type { ToggleProps } from '@src-types/ui/buttons';

/**
 * Toggle - Button-like toggle component that can be pressed/unpressed
 *
 * Features:
 * - Accessible: proper ARIA attributes and keyboard navigation
 * - Variants: default, outline
 * - Sizes: sm, md, lg
 * - Pressed/unpressed states
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Toggle pressed={isPressed} onPressedChange={setIsPressed}>
 *   Toggle me
 * </Toggle>
 * ```
 *
 * @example
 * ```tsx
 * <Toggle variant="outline" size="lg" pressed={isActive}>
 *   Active
 * </Toggle>
 * ```
 */
export default function Toggle({
	variant = 'default',
	size = 'md',
	pressed = false,
	onPressedChange,
	disabled,
	className,
	children,
	...props
}: Readonly<ToggleProps>) {
	const handleClick = () => {
		if (!disabled && onPressedChange) {
			onPressedChange(!pressed);
		}
	};

	return (
		<button
			type="button"
			aria-pressed={pressed}
			disabled={disabled}
			className={getToggleVariantClasses({ variant, size, pressed, className })}
			onClick={handleClick}
			{...props}
		>
			{children}
		</button>
	);
}
