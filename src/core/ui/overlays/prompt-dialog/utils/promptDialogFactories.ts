import {
	createDialogContent,
	createDialogFooter,
} from '@core/ui/overlays/prompt-dialog/helpers/PromptDialogHelpers';
import type {
	DialogPartsOptions,
	DialogPropsParams,
	PrepareDialogOptions,
	PrepareDialogPropsOptions,
} from '@core/ui/overlays/prompt-dialog/types/PromptDialogTypes';

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

function prepareDialogProps(options: PrepareDialogPropsOptions) {
	return createDialogProps(options);
}

export function preparePromptDialog(options: PrepareDialogOptions) {
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
