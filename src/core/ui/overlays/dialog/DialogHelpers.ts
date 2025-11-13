import type { KeyboardEvent, MouseEvent, SyntheticEvent } from 'react';

/**
 * Creates a cancel handler for dialog elements
 * Handles the native dialog cancel event (usually triggered by Escape key)
 */
export function createDialogCancelHandler(
	closeOnEscape: boolean,
	onClose: () => void
): (event: SyntheticEvent<HTMLDialogElement, Event>) => void {
	return (event: SyntheticEvent<HTMLDialogElement, Event>) => {
		if (closeOnEscape) {
			event.preventDefault();
			onClose();
		}
	};
}

/**
 * Creates event handlers for dialog overlay interactions
 */
export function createDialogEventHandlers(
	closeOnOverlayClick: boolean,
	onClose: () => void
): {
	readonly handleOverlayClick: (event: MouseEvent<HTMLDialogElement>) => void;
	readonly handleOverlayKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void;
} {
	const handleOverlayClick = (event: MouseEvent<HTMLDialogElement>) => {
		// Close dialog when clicking on the backdrop (the dialog element itself)
		if (closeOnOverlayClick && event.target === event.currentTarget) {
			onClose();
		}
	};

	const handleOverlayKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
		// Prevent default behavior for Escape key (handled by onCancel)
		if (event.key === 'Escape') {
			event.stopPropagation();
		}
	};

	return { handleOverlayClick, handleOverlayKeyDown };
}
