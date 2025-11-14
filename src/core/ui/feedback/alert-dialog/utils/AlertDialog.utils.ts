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
