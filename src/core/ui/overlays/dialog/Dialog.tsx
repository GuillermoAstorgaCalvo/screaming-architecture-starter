import { useDialogSetup } from '@core/ui/overlays/dialog/hooks/useDialogSetup';
import type { DialogProps } from '@core/ui/overlays/dialog/types/dialog.types';
import {
	extractDialogProps,
	prepareDialogOptions,
	renderDialogDialog,
} from '@core/ui/overlays/dialog/utils/dialogUtils';

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
