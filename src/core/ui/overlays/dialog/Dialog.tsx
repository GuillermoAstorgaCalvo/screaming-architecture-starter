import { DialogDialog } from '@core/ui/overlays/dialog/components/DialogDialog';
import { useDialogSetup } from '@core/ui/overlays/dialog/hooks/useDialogSetup';
import type { DialogProps } from '@core/ui/overlays/dialog/types/dialog.types';
import type { ModalSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

interface DialogSetupOptions {
	readonly dialogId?: string;
	readonly closeOnOverlayClick: boolean;
	readonly onClose: () => void;
}

function prepareDialogOptions(
	dialogId: string | undefined,
	closeOnOverlayClick: boolean,
	onClose: () => void
): DialogSetupOptions {
	if (dialogId !== undefined) {
		return { dialogId, closeOnOverlayClick, onClose };
	}
	return { closeOnOverlayClick, onClose };
}

interface DialogRenderProps {
	readonly setup: ReturnType<typeof useDialogSetup>;
	readonly className?: string;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
	readonly size: ModalSize;
	readonly variant: 'default' | 'centered' | 'fullscreen';
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly footer?: ReactNode;
	readonly children: ReactNode;
}

function buildDialogProps(props: DialogRenderProps) {
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

function renderDialogDialog(props: DialogRenderProps) {
	return <DialogDialog {...buildDialogProps(props)} />;
}

function extractDialogProps(props: Readonly<DialogProps>) {
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

/**
 * Dialog - Accessible dialog component with variants
 *
 * Features:
 * - Accessible: proper ARIA attributes, focus management, keyboard navigation
 * - Variants: default, centered, fullscreen
 * - Customizable sizes: sm, md, lg, xl, full
 * - Optional footer and close button
 * - Escape key and overlay click handling
 * - Focus trapping within dialog
 * - Dark mode support
 * - Restores focus to previous element on close
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Dialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Dialog Title"
 *   variant="centered"
 *   size="md"
 * >
 *   <p>Dialog content goes here</p>
 * </Dialog>
 * ```
 */
export default function Dialog(props: Readonly<DialogProps>) {
	const dialogProps = extractDialogProps(props);
	const setup = useDialogSetup(
		prepareDialogOptions(
			dialogProps.dialogId,
			dialogProps.closeOnOverlayClick,
			dialogProps.onClose
		),
		dialogProps.isOpen,
		dialogProps.closeOnEscape
	);

	if (!dialogProps.isOpen) {
		return null;
	}

	return renderDialogDialog({
		setup,
		...(dialogProps.className !== undefined && { className: dialogProps.className }),
		closeOnEscape: dialogProps.closeOnEscape,
		onClose: dialogProps.onClose,
		size: dialogProps.size,
		variant: dialogProps.variant,
		title: dialogProps.title,
		showCloseButton: dialogProps.showCloseButton,
		footer: dialogProps.footer,
		children: dialogProps.children,
	});
}
