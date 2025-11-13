import Button from '@core/ui/button/Button';
import type { ReactNode } from 'react';

import type { PromptDialogInputType } from './PromptDialog';
import { PromptDialogInput } from './PromptDialogInput';

export const DEFAULT_CONFIRM_LABEL = 'Confirm';
export const DEFAULT_CANCEL_LABEL = 'Cancel';

interface ConfirmHandlerOptions {
	value: string;
	validate?: ((value: string) => string | undefined) | undefined;
	required: boolean;
	onConfirm?: ((value: string) => void | Promise<void>) | undefined;
	onClose: () => void;
	setError: (error: string | undefined) => void;
}

/**
 * Creates a confirm handler that validates the input, executes the onConfirm callback, and then closes the dialog
 */
export function createConfirmHandler(options: ConfirmHandlerOptions): () => Promise<void> {
	const { value, validate, required, onConfirm, onClose, setError } = options;
	return async () => {
		// Validate required field
		if (required && !value.trim()) {
			setError('This field is required');
			return;
		}

		// Run custom validation
		if (validate) {
			const validationError = validate(value);
			if (validationError) {
				setError(validationError);
				return;
			}
		}

		// Clear any previous errors
		setError(undefined);

		// Execute confirm callback
		if (onConfirm) {
			await onConfirm(value);
		}
		onClose();
	};
}

/**
 * Creates a cancel handler that executes the onCancel callback and then closes the dialog
 */
export function createCancelHandler(
	onCancel: (() => void) | undefined,
	onClose: () => void
): () => void {
	return () => {
		if (onCancel) {
			onCancel();
		}
		onClose();
	};
}

interface FooterProps {
	cancelLabel: string;
	confirmLabel: string;
	onCancel: () => void;
	onConfirm: () => Promise<void>;
}

/**
 * Renders the footer with cancel and confirm buttons
 */
export function renderFooter({ cancelLabel, confirmLabel, onCancel, onConfirm }: FooterProps) {
	return (
		<div className="flex justify-end gap-2">
			<Button variant="secondary" onClick={onCancel}>
				{cancelLabel}
			</Button>
			<Button variant="primary" onClick={onConfirm}>
				{confirmLabel}
			</Button>
		</div>
	);
}

interface DialogContentOptions {
	label: string;
	inputType: PromptDialogInputType;
	value: string;
	handleValueChange: (value: string) => void;
	placeholder: string | undefined;
	required: boolean;
	error: string | undefined;
}

/**
 * Renders the dialog content with input field
 */
export function renderDialogContent(options: DialogContentOptions): ReactNode {
	const { label, inputType, value, handleValueChange, placeholder, required, error } = options;
	return (
		<PromptDialogInput
			label={label}
			type={inputType}
			value={value}
			onChange={handleValueChange}
			placeholder={placeholder}
			required={required}
			error={error}
		/>
	);
}

interface DialogFooterOptions {
	cancelLabel: string;
	confirmLabel: string;
	handleCancel: () => void;
	handleConfirm: () => Promise<void>;
}

/**
 * Creates the dialog footer
 */
export function createDialogFooter(options: DialogFooterOptions) {
	return renderFooter({
		cancelLabel: options.cancelLabel,
		confirmLabel: options.confirmLabel,
		onCancel: options.handleCancel,
		onConfirm: options.handleConfirm,
	});
}

/**
 * Creates the dialog content
 */
export function createDialogContent(options: DialogContentOptions): ReactNode {
	return renderDialogContent(options);
}
