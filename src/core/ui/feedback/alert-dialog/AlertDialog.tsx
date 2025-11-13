import Button from '@core/ui/button/Button';
import Modal from '@core/ui/modal/Modal';
import type { ReactNode } from 'react';

export interface AlertDialogProps {
	/** Whether the alert dialog is open */
	isOpen: boolean;
	/** Function to close the alert dialog */
	onClose: () => void;
	/** Alert dialog title */
	title: string;
	/** Alert dialog description/content */
	description?: ReactNode;
	/** Label for the confirm/primary action button */
	confirmLabel?: string;
	/** Label for the cancel/secondary action button */
	cancelLabel?: string;
	/** Callback when confirm button is clicked */
	onConfirm?: () => void | Promise<void>;
	/** Callback when cancel button is clicked */
	onCancel?: () => void;
	/** Whether the confirm action is destructive (changes button styling) @default false */
	destructive?: boolean;
	/** Whether to show cancel button @default true */
	showCancel?: boolean;
	/** Size of the alert dialog @default 'sm' */
	size?: 'sm' | 'md' | 'lg';
	/** Additional CSS classes */
	className?: string;
}

const DEFAULT_CONFIRM_LABEL = 'Confirm';
const DEFAULT_CANCEL_LABEL = 'Cancel';

/**
 * Creates a confirm handler that executes the onConfirm callback and then closes the dialog
 */
function createConfirmHandler(
	onConfirm: (() => void | Promise<void>) | undefined,
	onClose: () => void
): () => Promise<void> {
	return async () => {
		if (onConfirm) {
			await onConfirm();
		}
		onClose();
	};
}

/**
 * Creates a cancel handler that executes the onCancel callback and then closes the dialog
 */
function createCancelHandler(onCancel: (() => void) | undefined, onClose: () => void): () => void {
	return () => {
		if (onCancel) {
			onCancel();
		}
		onClose();
	};
}

interface FooterProps {
	showCancel: boolean;
	cancelLabel: string;
	confirmLabel: string;
	destructive: boolean;
	onCancel: () => void;
	onConfirm: () => Promise<void>;
}

/**
 * Renders the footer with cancel and confirm buttons
 */
function renderFooter({
	showCancel,
	cancelLabel,
	confirmLabel,
	destructive,
	onCancel,
	onConfirm,
}: FooterProps) {
	return (
		<div className="flex justify-end gap-2">
			{showCancel ? (
				<Button variant="secondary" onClick={onCancel}>
					{cancelLabel}
				</Button>
			) : null}
			<Button
				variant="primary"
				className={
					destructive
						? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
						: undefined
				}
				onClick={onConfirm}
			>
				{confirmLabel}
			</Button>
		</div>
	);
}

/**
 * Renders the description content if provided
 */
function renderDescription(description: ReactNode | undefined) {
	if (!description) {
		return null;
	}
	return <div className="text-sm text-muted-foreground">{description}</div>;
}

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
	confirmLabel = DEFAULT_CONFIRM_LABEL,
	cancelLabel = DEFAULT_CANCEL_LABEL,
	onConfirm,
	onCancel,
	destructive = false,
	showCancel = true,
	size = 'sm',
	className,
}: Readonly<AlertDialogProps>) {
	const handleConfirm = createConfirmHandler(onConfirm, onClose);
	const handleCancel = createCancelHandler(onCancel, onClose);

	const footer = renderFooter({
		showCancel,
		cancelLabel,
		confirmLabel,
		destructive,
		onCancel: handleCancel,
		onConfirm: handleConfirm,
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
			{renderDescription(description)}
		</Modal>
	);
}
