import type { ModalSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

import type { PromptDialogInputType, PromptDialogVariant } from './PromptDialog';

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
