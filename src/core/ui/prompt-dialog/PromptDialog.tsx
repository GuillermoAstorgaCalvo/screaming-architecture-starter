import Dialog from '@core/ui/dialog/Dialog';
import type { ModalSize } from '@src-types/ui/base';

import {
	createDialogContent,
	createDialogFooter,
	DEFAULT_CANCEL_LABEL,
	DEFAULT_CONFIRM_LABEL,
} from './PromptDialogHelpers';
import { usePromptDialogState } from './PromptDialogHooks';
import type {
	DialogPartsOptions,
	DialogPropsParams,
	PrepareDialogOptions,
	PrepareDialogPropsOptions,
} from './PromptDialogTypes';

export type PromptDialogVariant = 'default' | 'centered' | 'fullscreen';
export type PromptDialogInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

export interface PromptDialogProps {
	/** Whether the prompt dialog is open */
	isOpen: boolean;
	/** Function to close the prompt dialog */
	onClose: () => void;
	/** Prompt dialog title */
	title: string;
	/** Prompt dialog description/label */
	label?: string;
	/** Placeholder text for the input */
	placeholder?: string;
	/** Initial value for the input */
	defaultValue?: string;
	/** Label for the confirm/primary action button */
	confirmLabel?: string;
	/** Label for the cancel/secondary action button */
	cancelLabel?: string;
	/** Callback when confirm button is clicked with the input value */
	onConfirm?: (value: string) => void | Promise<void>;
	/** Callback when cancel button is clicked */
	onCancel?: () => void;
	/** Whether the input is required @default false */
	required?: boolean;
	/** Validation function that returns an error message if invalid */
	validate?: (value: string) => string | undefined;
	/** Size of the prompt dialog @default 'sm' */
	size?: ModalSize;
	/** Dialog variant @default 'centered' */
	variant?: PromptDialogVariant;
	/** Input type @default 'text' */
	inputType?: PromptDialogInputType;
	/** Additional CSS classes */
	className?: string;
}

/**
 * Creates dialog props
 */
function createDialogProps({
	isOpen,
	onClose,
	title,
	size,
	variant,
	footer,
	content,
	className,
}: DialogPropsParams) {
	return {
		isOpen,
		onClose,
		title,
		size,
		variant,
		showCloseButton: false,
		footer,
		closeOnOverlayClick: false,
		...(className !== undefined && { className }),
		children: content,
	};
}

/**
 * Creates dialog parts (footer and content)
 */
function createDialogParts(options: DialogPartsOptions) {
	const {
		label,
		inputType,
		value,
		handleValueChange,
		placeholder,
		required,
		error,
		cancelLabel,
		confirmLabel,
		handleCancel,
		handleConfirm,
	} = options;

	const footer = createDialogFooter({
		cancelLabel,
		confirmLabel,
		handleCancel,
		handleConfirm,
	});
	const dialogContent = createDialogContent({
		label,
		inputType,
		value,
		handleValueChange,
		placeholder,
		required,
		error,
	});

	return { footer, dialogContent };
}

/**
 * Prepares dialog props from parts
 */
function prepareDialogProps(options: PrepareDialogPropsOptions) {
	return createDialogProps(options);
}

/**
 * Normalizes props with default values
 */
function normalizeProps(props: Readonly<PromptDialogProps>) {
	return {
		isOpen: props.isOpen,
		onClose: props.onClose,
		title: props.title,
		label: props.label ?? 'Input',
		placeholder: props.placeholder,
		defaultValue: props.defaultValue ?? '',
		confirmLabel: props.confirmLabel ?? DEFAULT_CONFIRM_LABEL,
		cancelLabel: props.cancelLabel ?? DEFAULT_CANCEL_LABEL,
		onConfirm: props.onConfirm,
		onCancel: props.onCancel,
		required: props.required ?? false,
		validate: props.validate,
		size: props.size ?? 'sm',
		variant: props.variant ?? 'centered',
		inputType: props.inputType ?? 'text',
		className: props.className,
	};
}

/**
 * Builds dialog props from normalized props and state
 */
function buildDialogProps(
	normalizedProps: ReturnType<typeof normalizeProps>,
	state: ReturnType<typeof usePromptDialogState>
) {
	return prepareDialog({
		label: normalizedProps.label,
		inputType: normalizedProps.inputType,
		value: state.value,
		handleValueChange: state.handleValueChange,
		placeholder: normalizedProps.placeholder,
		required: normalizedProps.required,
		error: state.error,
		cancelLabel: normalizedProps.cancelLabel,
		confirmLabel: normalizedProps.confirmLabel,
		handleCancel: state.handleCancel,
		handleConfirm: state.handleConfirm,
		isOpen: normalizedProps.isOpen,
		onClose: state.handleClose,
		title: normalizedProps.title,
		size: normalizedProps.size,
		variant: normalizedProps.variant,
		className: normalizedProps.className,
	});
}

/**
 * Prepares all dialog parts and props
 */
function prepareDialog(options: PrepareDialogOptions) {
	const { isOpen, onClose, title, size, variant, className, ...partsOptions } = options;
	const { footer, dialogContent } = createDialogParts(partsOptions);
	return prepareDialogProps({
		isOpen,
		onClose,
		title,
		size,
		variant,
		footer,
		content: dialogContent,
		className,
	});
}

/**
 * PromptDialog - Dialog that prompts for text input
 *
 * Features:
 * - Accessible: proper ARIA attributes
 * - Input validation support
 * - Required field validation
 * - Focus management and keyboard navigation
 * - Dark mode support
 * - Supports different variants (default, centered, fullscreen)
 * - Supports different input types (text, email, password, number, tel, url)
 *
 * @example
 * ```tsx
 * <PromptDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Enter Name"
 *   label="Name"
 *   placeholder="Enter your name"
 *   onConfirm={(value) => console.log(value)}
 *   required
 * />
 * ```
 *
 * @example
 * ```tsx
 * <PromptDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Enter Email"
 *   label="Email"
 *   inputType="email"
 *   validate={(value) => {
 *     if (!value.includes('@')) {
 *       return 'Please enter a valid email address';
 *     }
 *   }}
 *   onConfirm={(value) => handleEmailSubmit(value)}
 * />
 * ```
 */
export default function PromptDialog(props: Readonly<PromptDialogProps>) {
	const normalizedProps = normalizeProps(props);
	const state = usePromptDialogState({
		defaultValue: normalizedProps.defaultValue,
		onClose: normalizedProps.onClose,
		validate: normalizedProps.validate,
		required: normalizedProps.required,
		onConfirm: normalizedProps.onConfirm,
		onCancel: normalizedProps.onCancel,
	});
	const dialogProps = buildDialogProps(normalizedProps, state);
	return <Dialog {...dialogProps} />;
}
