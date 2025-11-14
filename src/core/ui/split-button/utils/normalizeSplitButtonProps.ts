import { DEFAULT_PROPS } from '@core/ui/split-button/constants/SplitButtonDefaults';
import type { NormalizedSplitButtonProps } from '@core/ui/split-button/types/SplitButtonTypes';
import type { SplitButtonProps } from '@src-types/ui/buttons';

/**
 * Applies default value if prop is undefined
 *
 * @internal
 */
function withDefault<T>(value: T | undefined, fallback: T): T {
	return value ?? fallback;
}

/**
 * Normalizes SplitButton props by merging with defaults
 *
 * @param props - Raw props from component
 * @returns Normalized props with defaults applied
 *
 * @internal
 */
export function normalizeSplitButtonProps(
	props: Readonly<SplitButtonProps>
): NormalizedSplitButtonProps {
	const {
		variant,
		size,
		isLoading,
		disabled,
		onClick,
		menuItems,
		onMenuItemSelect,
		menuAlign,
		dropdownAriaLabel,
		className,
		children,
		type,
		...rest
	} = props;

	return {
		variant: withDefault(variant, DEFAULT_PROPS.variant),
		size: withDefault(size, DEFAULT_PROPS.size),
		isLoading: withDefault(isLoading, DEFAULT_PROPS.isLoading),
		disabled,
		onClick,
		menuItems,
		onMenuItemSelect,
		menuAlign: withDefault(menuAlign, DEFAULT_PROPS.menuAlign),
		dropdownAriaLabel: withDefault(dropdownAriaLabel, DEFAULT_PROPS.dropdownAriaLabel),
		className,
		children,
		type: withDefault(type, DEFAULT_PROPS.type),
		buttonProps: rest,
	};
}
