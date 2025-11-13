import Dialog from '@core/ui/dialog/Dialog';
import {
	DEFAULT_CANCEL_LABEL,
	DEFAULT_CONFIRM_LABEL,
} from '@core/ui/overlays/confirm-dialog/helpers/confirmDialog.constants';
import {
	prepareDialogProps,
	prepareHandlers,
	renderDescription,
	renderFooter,
} from '@core/ui/overlays/confirm-dialog/helpers/ConfirmDialog.helpers';
import type { ConfirmDialogProps } from '@core/ui/overlays/confirm-dialog/types/confirmDialog.types';

/**
 * ConfirmDialog - Specialized confirmation dialog wrapper
 *
 * Features:
 * - Accessible: proper ARIA attributes (uses dialog role)
 * - Pre-configured action buttons (confirm/cancel)
 * - Simpler API than Dialog for confirmations
 * - Focus management and keyboard navigation
 * - Dark mode support
 * - Supports different variants (default, centered, fullscreen)
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item? This action cannot be undone."
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   onConfirm={handleDelete}
 *   destructive
 * />
 * ```
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   title="Save Changes"
 *   description="Your changes have been saved successfully."
 *   confirmLabel="OK"
 *   showCancel={false}
 *   onConfirm={() => setShowConfirm(false)}
 *   variant="centered"
 * />
 * ```
 */
export default function ConfirmDialog({
	isOpen,
	onClose,
	title,
	description,
	confirmLabel = DEFAULT_CONFIRM_LABEL,
	cancelLabel = DEFAULT_CANCEL_LABEL,
	onConfirm,
	onCancel,
	destructive = false,
	showCancel = true,
	size = 'sm',
	variant = 'centered',
	className,
}: Readonly<ConfirmDialogProps>) {
	const { handleConfirm, handleCancel } = prepareHandlers(onConfirm, onCancel, onClose);

	const footer = renderFooter({
		showCancel,
		cancelLabel,
		confirmLabel,
		destructive,
		onCancel: handleCancel,
		onConfirm: handleConfirm,
	});

	const dialogContent = renderDescription(description);

	const dialogProps = prepareDialogProps({
		isOpen,
		onClose,
		title,
		size,
		variant,
		className,
		footer,
		children: dialogContent,
	});

	return <Dialog {...dialogProps} />;
}
