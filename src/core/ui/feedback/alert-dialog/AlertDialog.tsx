import { useTranslation } from '@core/i18n/useTranslation';
import { AlertDialogDescription } from '@core/ui/feedback/alert-dialog/components/AlertDialogComponents';
import { createAlertDialogFooter } from '@core/ui/feedback/alert-dialog/helpers/AlertDialog.helpers';
import type { AlertDialogProps } from '@core/ui/feedback/alert-dialog/types/AlertDialog.types';
import Modal from '@core/ui/modal/Modal';

export type { AlertDialogProps } from '@core/ui/feedback/alert-dialog/types/AlertDialog.types';

/**
 * AlertDialog - Simple alert/confirmation dialog component
 *
 * Features:
 * - Accessible: proper ARIA attributes (uses alertdialog role)
 * - Pre-configured action buttons (confirm/cancel)
 * - Simpler API than Modal for confirmations/alerts
 * - Focus management and keyboard navigation
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <AlertDialog
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
 * <AlertDialog
 *   isOpen={showAlert}
 *   onClose={() => setShowAlert(false)}
 *   title="Success"
 *   description="Your changes have been saved."
 *   confirmLabel="OK"
 *   showCancel={false}
 *   onConfirm={() => setShowAlert(false)}
 * />
 * ```
 */
export default function AlertDialog({
	isOpen,
	onClose,
	title,
	description,
	confirmLabel,
	cancelLabel,
	onConfirm,
	onCancel,
	destructive = false,
	showCancel = true,
	size = 'sm',
	className,
}: Readonly<AlertDialogProps>) {
	const { t } = useTranslation('common');
	const footer = createAlertDialogFooter({
		showCancel,
		cancelLabel: cancelLabel ?? t('cancel'),
		confirmLabel: confirmLabel ?? t('confirm'),
		destructive,
		onConfirm,
		onCancel,
		onClose,
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			size={size}
			showCloseButton={false}
			footer={footer}
			closeOnOverlayClick={false}
			{...(className !== undefined && { className })}
		>
			<AlertDialogDescription description={description} />
		</Modal>
	);
}
