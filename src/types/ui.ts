import type {
	ButtonHTMLAttributes,
	HTMLAttributes,
	InputHTMLAttributes,
	LabelHTMLAttributes,
	ReactNode,
	SVGProps,
} from 'react';

/**
 * Standard size variants used across most UI components
 */
export type StandardSize = 'sm' | 'md' | 'lg';

/**
 * Modal size variants (extends StandardSize with xl and full)
 */
export type ModalSize = StandardSize | 'xl' | 'full';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Icon button variant types
 */
export type IconButtonVariant = 'default' | 'ghost';

/**
 * Base props for all icon components
 */
export interface BaseIconProps extends SVGProps<SVGSVGElement> {
	/** Size of the icon */
	size?: StandardSize;
}

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
 * Input component props
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
	/** Label text for the input. If provided, renders a label element */
	label?: string;
	/** Error message to display below the input */
	error?: string;
	/** Helper text to display below the input */
	helperText?: string;
	/** Size of the input @default 'md' */
	size?: StandardSize;
	/** Whether the input takes full width @default false */
	fullWidth?: boolean;
	/** Icon or element to display on the left side of the input */
	leftIcon?: ReactNode;
	/** Icon or element to display on the right side of the input */
	rightIcon?: ReactNode;
	/** ID for the input element. If not provided and label exists, will be auto-generated */
	inputId?: string;
}

/**
 * Label component props
 */
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	/** Label text or content */
	children: ReactNode;
	/** Whether the field is required (shows asterisk) @default false */
	required?: boolean;
	/** Size variant @default 'md' */
	size?: StandardSize;
}

/**
 * Base props for text message components (ErrorText and HelperText)
 */
export interface BaseTextMessageProps extends HTMLAttributes<HTMLParagraphElement> {
	/** Message content to display */
	children: ReactNode;
	/** Optional ID for ARIA relationships */
	id?: string;
	/** Size variant @default 'md' */
	size?: StandardSize;
}

/**
 * Error text component props
 */
export interface ErrorTextProps extends BaseTextMessageProps {}

/**
 * Helper text component props
 */
export interface HelperTextProps extends BaseTextMessageProps {}

/**
 * Spinner component props
 */
export interface SpinnerProps extends Omit<SVGProps<SVGSVGElement>, 'size'> {
	/**
	 * Size of the spinner
	 * @default 'md'
	 */
	size?: StandardSize | number;
	/**
	 * Color of the spinner
	 * @default 'currentColor'
	 */
	color?: string;
	/**
	 * Accessible label for the spinner
	 * @default 'Loading'
	 */
	'aria-label'?: string;
}

/**
 * Modal component props
 */
export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	/** @default 'md' */
	size?: ModalSize;
	/** @default true */
	showCloseButton?: boolean;
	footer?: ReactNode;
	className?: string;
	/** @default true */
	closeOnOverlayClick?: boolean;
	/** @default true */
	closeOnEscape?: boolean;
	modalId?: string;
}
