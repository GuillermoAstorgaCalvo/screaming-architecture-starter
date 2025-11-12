import type { DropdownMenuItemOrSeparator } from '@core/ui/dropdown-menu/DropdownMenu.types';
import Icon from '@core/ui/icons/Icon';
import { getButtonVariantClasses } from '@core/ui/variants/button';
import { classNames } from '@core/utils/classNames';
import type { ButtonVariant, SplitButtonProps } from '@src-types/ui/buttons';
import type { ReactElement } from 'react';

/**
 * Gets the border color class for the divider based on button variant
 *
 * @param variant - Button variant
 * @returns Border color class string
 *
 * @internal
 */
export function getBorderColorClass(variant: ButtonVariant): string {
	if (variant === 'primary') {
		return 'border-l-primary-foreground/20';
	}
	if (variant === 'secondary') {
		return 'border-l-secondary-foreground/20';
	}
	return 'border-l-border';
}

/**
 * Gets the CSS classes for the main button part
 *
 * @param variant - Button variant
 * @param size - Button size
 * @param className - Additional classes
 * @returns Button classes string
 *
 * @internal
 */
export function getMainButtonClasses(
	variant: ButtonVariant,
	size: SplitButtonProps['size'],
	className?: string
): string {
	return getButtonVariantClasses({
		variant,
		size,
		className: classNames('rounded-r-none', className),
	});
}

/**
 * Gets the CSS classes for the dropdown trigger button
 *
 * @param variant - Button variant
 * @param size - Button size
 * @param borderColorClass - Border color class for the divider
 * @returns Dropdown button classes string
 *
 * @internal
 */
export function getDropdownButtonClasses(
	variant: ButtonVariant,
	size: SplitButtonProps['size'],
	borderColorClass: string
): string {
	return getButtonVariantClasses({
		variant,
		size,
		className: classNames('rounded-l-none px-2', borderColorClass, 'border-l'),
	});
}

interface CreateDropdownTriggerParams {
	readonly disabled: boolean | undefined;
	readonly isLoading: boolean;
	readonly dropdownButtonClasses: string;
	readonly dropdownAriaLabel: string;
}

/**
 * Creates the dropdown trigger button element
 *
 * @param params - Parameters for creating the dropdown trigger
 * @returns Dropdown trigger React element
 *
 * @internal
 */
export function createDropdownTrigger({
	disabled,
	isLoading,
	dropdownButtonClasses,
	dropdownAriaLabel,
}: Readonly<CreateDropdownTriggerParams>): ReactElement {
	return (
		<button
			type="button"
			disabled={(disabled ?? false) || isLoading}
			className={dropdownButtonClasses}
			aria-label={dropdownAriaLabel}
		>
			<Icon name="arrow-down" size="sm" aria-hidden="true" />
		</button>
	);
}

/**
 * Checks if an item is a separator
 *
 * @param item - Menu item or separator
 * @returns True if the item is a separator
 *
 * @internal
 */
export function isSeparator(
	item: DropdownMenuItemOrSeparator
): item is { readonly id: string; readonly type: 'separator' } {
	return 'type' in item;
}

interface HandleMenuItemSelectParams {
	readonly item: DropdownMenuItemOrSeparator;
	readonly onMenuItemSelect?: SplitButtonProps['onMenuItemSelect'];
}

/**
 * Handles menu item selection
 *
 * @param params - Parameters containing the item and callback
 *
 * @internal
 */
export function handleMenuItemSelect({
	item,
	onMenuItemSelect,
}: Readonly<HandleMenuItemSelectParams>): void {
	if (isSeparator(item)) {
		return;
	}
	// TypeScript narrows to DropdownMenuItem after the separator check
	onMenuItemSelect?.(item);
	const result = item.onSelect?.();
	if (result instanceof Promise) {
		result.catch(() => {
			// Ignore errors from async select handler
		});
	}
}
