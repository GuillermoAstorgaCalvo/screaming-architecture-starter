import type { PopconfirmHandlers } from '@core/ui/overlays/popconfirm/types/popconfirm.types';

/**
 * Creates a confirm handler that executes the onConfirm callback and then closes the popconfirm
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
 * Creates a cancel handler that executes the onCancel callback and then closes the popconfirm
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
 * Creates and returns the confirm and cancel handlers
 */
export function prepareHandlers(
	onConfirm: (() => void | Promise<void>) | undefined,
	onCancel: (() => void) | undefined,
	onClose: () => void
): PopconfirmHandlers {
	return {
		handleConfirm: createConfirmHandler(onConfirm, onClose),
		handleCancel: createCancelHandler(onCancel, onClose),
	};
}
