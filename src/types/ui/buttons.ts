import type { ButtonHTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

import type { StandardSize } from './base';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Icon button variant types
 */
export type IconButtonVariant = 'default' | 'ghost';

/**
 * Button component props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * Visual variant of the button
	 * @default 'primary'
	 */
	variant?: ButtonVariant;
	/**
	 * Size of the button
	 * @default 'md'
	 */
	size?: StandardSize;
	/**
	 * Button content
	 */
	children: ReactNode;
	/**
	 * Whether the button is in a loading state
	 * @default false
	 */
	isLoading?: boolean;
	/**
	 * Whether the button should take full width
	 * @default false
	 */
	fullWidth?: boolean;
}

/**
 * Icon button component props
 */
export interface IconButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
	/** Icon content to display */
	icon: ReactNode;
	/** Accessible label for the button (required for accessibility) */
	'aria-label': string;
	/** Optional tooltip title */
	title?: string;
	/** Size variant @default 'md' */
	size?: StandardSize;
	/** Visual variant @default 'default' */
	variant?: IconButtonVariant;
}

/**
 * Toggle variant types
 */
export type ToggleVariant = 'default' | 'outline';

/**
 * Toggle component props
 */
export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
	/**
	 * Visual variant of the toggle
	 * @default 'default'
	 */
	variant?: ToggleVariant;
	/**
	 * Size of the toggle
	 * @default 'md'
	 */
	size?: StandardSize;
	/**
	 * Whether the toggle is pressed
	 * @default false
	 */
	pressed?: boolean;
	/**
	 * Callback when pressed state changes
	 */
	onPressedChange?: (pressed: boolean) => void;
	/**
	 * Toggle content
	 */
	children: ReactNode;
}

/**
 * Copy button component props
 */
export interface CopyButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'onClick'> {
	/** Text to copy to clipboard */
	text: string;
	/** Accessible label for the button @default 'Copy to clipboard' */
	'aria-label'?: string;
	/** Tooltip text when not copied @default 'Copy to clipboard' */
	copyTooltip?: string;
	/** Tooltip text when copied @default 'Copied!' */
	copiedTooltip?: string;
	/** Size variant @default 'md' */
	size?: StandardSize;
	/** Visual variant @default 'default' */
	variant?: IconButtonVariant;
	/** Callback when copy succeeds */
	onCopySuccess?: () => void;
	/** Callback when copy fails */
	onCopyError?: (error: Error) => void;
	/** Duration to show success state in milliseconds @default 2000 */
	successDuration?: number;
}

/**
 * Split button component props
 */
export interface SplitButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'> {
	/**
	 * Visual variant of the button
	 * @default 'primary'
	 */
	variant?: ButtonVariant;
	/**
	 * Size of the button
	 * @default 'md'
	 */
	size?: StandardSize;
	/**
	 * Button content (displayed in the main button part)
	 */
	children: ReactNode;
	/**
	 * Whether the button is in a loading state
	 * @default false
	 */
	isLoading?: boolean;
	/**
	 * Callback when the main button is clicked
	 */
	onClick?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
	/**
	 * Dropdown menu items
	 */
	menuItems: Array<
		| {
				readonly id: string;
				readonly label: ReactNode;
				readonly description?: ReactNode;
				readonly icon?: ReactNode;
				readonly shortcut?: string;
				readonly disabled?: boolean;
				readonly onSelect?: () => void | Promise<void>;
		  }
		| { readonly id: string; readonly type: 'separator' }
	>;
	/**
	 * Callback when a menu item is selected
	 */
	onMenuItemSelect?: (item: {
		readonly id: string;
		readonly label: ReactNode;
		readonly description?: ReactNode;
		readonly icon?: ReactNode;
		readonly shortcut?: string;
		readonly disabled?: boolean;
		readonly onSelect?: () => void | Promise<void>;
	}) => void;
	/**
	 * Dropdown menu alignment
	 * @default 'end'
	 */
	menuAlign?: 'start' | 'center' | 'end';
	/**
	 * Accessible label for the dropdown trigger
	 * @default 'More options'
	 */
	dropdownAriaLabel?: string;
	/**
	 * Additional className for the container
	 */
	className?: string;
}
