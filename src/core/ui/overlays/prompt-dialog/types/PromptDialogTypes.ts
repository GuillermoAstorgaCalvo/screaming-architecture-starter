import type { ModalSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

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

export interface NormalizedPromptDialogProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	label: string;
	placeholder?: string;
	defaultValue: string;
	confirmLabel: string;
	cancelLabel: string;
	onConfirm?: (value: string) => void | Promise<void>;
	onCancel?: () => void;
	required: boolean;
	validate?: (value: string) => string | undefined;
	size: ModalSize;
	variant: PromptDialogVariant;
	inputType: PromptDialogInputType;
	className?: string;
}

export interface DialogContentOptions {
	label: string;
	inputType: PromptDialogInputType;
	value: string;
	handleValueChange: (value: string) => void;
	placeholder: string | undefined;
	required: boolean;
	error: string | undefined;
}

export interface DialogPropsParams {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	size: ModalSize;
	variant: PromptDialogVariant;
	footer: ReactNode;
	content: ReactNode;
	className?: string | undefined;
}

export interface DialogPartsOptions {
	label: string;
	inputType: PromptDialogInputType;
	value: string;
	handleValueChange: (value: string) => void;
	placeholder: string | undefined;
	required: boolean;
	error: string | undefined;
	cancelLabel: string;
	confirmLabel: string;
	handleCancel: () => void;
	handleConfirm: () => Promise<void>;
}

export interface PrepareDialogPropsOptions {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	size: ModalSize;
	variant: PromptDialogVariant;
	footer: ReactNode;
	content: ReactNode;
	className: string | undefined;
}

export interface PrepareDialogOptions extends DialogPartsOptions {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	size: ModalSize;
	variant: PromptDialogVariant;
	className: string | undefined;
}
