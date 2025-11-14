import type { ButtonVariant, SplitButtonProps } from '@src-types/ui/buttons';

/**
 * Button type for the main button element
 *
 * @internal
 */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Menu alignment options for the dropdown
 *
 * @internal
 */
export type MenuAlign = 'start' | 'center' | 'end';

/**
 * Props that are passed through to the underlying button element
 * (excludes SplitButton-specific props)
 *
 * @internal
 */
export type ButtonPropsOnly = Omit<
	SplitButtonProps,
	| 'variant'
	| 'size'
	| 'isLoading'
	| 'disabled'
	| 'onClick'
	| 'menuItems'
	| 'onMenuItemSelect'
	| 'menuAlign'
	| 'dropdownAriaLabel'
	| 'className'
	| 'children'
	| 'type'
>;

/**
 * Normalized props after merging with defaults
 *
 * @internal
 */
export interface NormalizedSplitButtonProps {
	readonly variant: ButtonVariant;
	readonly size: SplitButtonProps['size'];
	readonly isLoading: boolean;
	readonly disabled: boolean | undefined;
	readonly onClick: SplitButtonProps['onClick'];
	readonly menuItems: SplitButtonProps['menuItems'];
	readonly onMenuItemSelect: SplitButtonProps['onMenuItemSelect'];
	readonly menuAlign: MenuAlign;
	readonly dropdownAriaLabel: string;
	readonly className: string | undefined;
	readonly children: SplitButtonProps['children'];
	readonly type: ButtonType;
	readonly buttonProps: ButtonPropsOnly;
}
