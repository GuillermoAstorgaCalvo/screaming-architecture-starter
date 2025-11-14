import Button from '@core/ui/button/Button';
import DropdownMenu from '@core/ui/overlays/dropdown-menu/DropdownMenu';
import type { DropdownMenuItem } from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import type {
	ButtonPropsOnly,
	ButtonType,
	MenuAlign,
} from '@core/ui/split-button/types/SplitButtonTypes';
import type { ButtonVariant, SplitButtonProps } from '@src-types/ui/buttons';
import type { ReactElement } from 'react';

interface RenderMainButtonParams {
	readonly variant: ButtonVariant;
	readonly size: SplitButtonProps['size'];
	readonly isLoading: boolean;
	readonly disabled: boolean | undefined;
	readonly onClick: SplitButtonProps['onClick'];
	readonly type: ButtonType;
	readonly buttonClasses: string;
	readonly children: SplitButtonProps['children'];
	readonly buttonProps: ButtonPropsOnly;
}

/**
 * Renders the main button part of the split button
 *
 * @param params - Parameters for rendering the main button
 * @returns Main button JSX
 *
 * @internal
 */
export function renderMainButton({
	variant,
	size,
	isLoading,
	disabled,
	onClick,
	type,
	buttonClasses,
	children,
	buttonProps,
}: Readonly<RenderMainButtonParams>): ReactElement {
	return (
		<Button
			variant={variant}
			size={size ?? 'md'}
			isLoading={isLoading}
			disabled={disabled}
			onClick={onClick}
			type={type}
			className={buttonClasses}
			{...buttonProps}
		>
			{children}
		</Button>
	);
}

interface RenderDropdownMenuParams {
	readonly dropdownTrigger: ReactElement;
	readonly menuItems: SplitButtonProps['menuItems'];
	readonly handleSelect: (item: DropdownMenuItem) => void;
	readonly menuAlign: MenuAlign;
	readonly dropdownAriaLabel: string;
}

/**
 * Renders the dropdown menu part of the split button
 *
 * @param params - Parameters for rendering the dropdown menu
 * @returns Dropdown menu JSX
 *
 * @internal
 */
export function renderDropdownMenu({
	dropdownTrigger,
	menuItems,
	handleSelect,
	menuAlign,
	dropdownAriaLabel,
}: Readonly<RenderDropdownMenuParams>): ReactElement {
	return (
		<DropdownMenu
			trigger={dropdownTrigger}
			items={menuItems}
			onSelect={handleSelect}
			align={menuAlign}
			menuLabel={dropdownAriaLabel}
		/>
	);
}

interface RenderSplitButtonParams {
	readonly variant: ButtonVariant;
	readonly size: SplitButtonProps['size'];
	readonly isLoading: boolean;
	readonly disabled: boolean | undefined;
	readonly onClick: SplitButtonProps['onClick'];
	readonly type: ButtonType;
	readonly buttonClasses: string;
	readonly dropdownTrigger: ReactElement;
	readonly menuItems: SplitButtonProps['menuItems'];
	readonly handleSelect: (item: DropdownMenuItem) => void;
	readonly menuAlign: MenuAlign;
	readonly dropdownAriaLabel: string;
	readonly children: SplitButtonProps['children'];
	readonly buttonProps: ButtonPropsOnly;
}

/**
 * Renders the split button component
 *
 * @param params - Parameters for rendering the split button
 * @returns Split button JSX
 *
 * @internal
 */
export function renderSplitButton({
	variant,
	size,
	isLoading,
	disabled,
	onClick,
	type,
	buttonClasses,
	dropdownTrigger,
	menuItems,
	handleSelect,
	menuAlign,
	dropdownAriaLabel,
	children,
	buttonProps,
}: Readonly<RenderSplitButtonParams>) {
	return (
		<div className="inline-flex">
			{renderMainButton({
				variant,
				size,
				isLoading,
				disabled,
				onClick,
				type,
				buttonClasses,
				children,
				buttonProps,
			})}
			{renderDropdownMenu({
				dropdownTrigger,
				menuItems,
				handleSelect,
				menuAlign,
				dropdownAriaLabel,
			})}
		</div>
	);
}
