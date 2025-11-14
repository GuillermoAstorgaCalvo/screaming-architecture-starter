import { DialogDialog } from '@core/ui/overlays/dialog/components/DialogDialog';
import type {
	DialogProps,
	DialogRenderProps,
	DialogSetupOptions,
	ExtractedDialogProps,
} from '@core/ui/overlays/dialog/types/dialog.types';

/**
 * Prepares dialog setup options from individual parameters
 */
export function prepareDialogOptions(
	dialogId: string | undefined,
	closeOnOverlayClick: boolean,
	onClose: () => void
): DialogSetupOptions {
	if (dialogId !== undefined) {
		return { dialogId, closeOnOverlayClick, onClose };
	}
	return { closeOnOverlayClick, onClose };
}

/**
 * Builds props for the DialogDialog component from render props
 */
export function buildDialogProps(props: DialogRenderProps) {
	const {
		setup,
		className,
		closeOnEscape,
		onClose,
		size,
		variant,
		title,
		showCloseButton,
		footer,
		children,
	} = props;
	return {
		dialogRef: setup.dialogRef,
		titleId: setup.titleId,
		descriptionId: setup.descriptionId,
		...(className !== undefined && { className }),
		closeOnEscape,
		onClose,
		handleOverlayClick: setup.handleOverlayClick,
		handleOverlayKeyDown: setup.handleOverlayKeyDown,
		size,
		variant,
		title,
		showCloseButton,
		footer,
		children,
	};
}

/**
 * Renders the DialogDialog component with the provided props
 */
export function renderDialogDialog(props: DialogRenderProps) {
	return <DialogDialog {...buildDialogProps(props)} />;
}

/**
 * Extracts and normalizes dialog props with default values
 */
export function extractDialogProps(props: Readonly<DialogProps>): ExtractedDialogProps {
	return {
		isOpen: props.isOpen,
		onClose: props.onClose,
		title: props.title,
		children: props.children,
		size: props.size ?? 'md',
		variant: props.variant ?? 'default',
		showCloseButton: props.showCloseButton ?? true,
		footer: props.footer,
		className: props.className,
		closeOnOverlayClick: props.closeOnOverlayClick ?? true,
		closeOnEscape: props.closeOnEscape ?? true,
		dialogId: props.dialogId,
	};
}
