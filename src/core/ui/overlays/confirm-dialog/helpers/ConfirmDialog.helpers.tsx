import Button from '@core/ui/button/Button';
import type {
	DialogProps,
	DialogVariant,
	FooterProps,
	Handlers,
} from '@core/ui/overlays/confirm-dialog/types/confirmDialog.types';
import type { ModalSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

/**
 * Creates a confirm handler that executes the onConfirm callback and then closes the dialog
 */
export function createConfirmHandler(
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

/**
 * Renders the footer with cancel and confirm buttons
 */
export function renderFooter({
	showCancel,
	cancelLabel,
	confirmLabel,
	destructive,
	onCancel,
	onConfirm,
}: FooterProps): ReactNode {
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
export function renderDescription(description: ReactNode | undefined): ReactNode | null {
	if (!description) {
		return null;
	}
	return <div className="text-sm text-muted-foreground">{description}</div>;
}

/**
 * Creates and returns the confirm and cancel handlers
 */
export function prepareHandlers(
	onConfirm: (() => void | Promise<void>) | undefined,
	onCancel: (() => void) | undefined,
	onClose: () => void
): Handlers {
	return {
		handleConfirm: createConfirmHandler(onConfirm, onClose),
		handleCancel: createCancelHandler(onCancel, onClose),
	};
}

/**
 * Prepares and returns the Dialog component props
 */
export function prepareDialogProps({
	isOpen,
	onClose,
	title,
	size,
	variant,
	className,
	footer,
	children,
}: DialogProps): {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly title: string;
	readonly size: ModalSize;
	readonly variant: DialogVariant;
	readonly showCloseButton: boolean;
	readonly footer: ReactNode;
	readonly closeOnOverlayClick: boolean;
	readonly children: ReactNode;
	readonly className?: string;
} {
	const baseProps = {
		isOpen,
		onClose,
		title,
		size,
		variant,
		showCloseButton: false,
		footer,
		closeOnOverlayClick: false,
		children,
	};
	if (className === undefined) {
		return baseProps;
	}
	return { ...baseProps, className };
}
