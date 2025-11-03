import type React from 'react';

export function createOverlayClickHandler(
	closeOnOverlayClick: boolean,
	onClose: () => void
): (event: React.MouseEvent<HTMLDialogElement>) => void {
	return (event: React.MouseEvent<HTMLDialogElement>): void => {
		if (!closeOnOverlayClick || event.target !== event.currentTarget) {
			return;
		}
		onClose();
	};
}

export function createOverlayKeyDownHandler(
	closeOnOverlayClick: boolean,
	onClose: () => void
): (event: React.KeyboardEvent<HTMLDialogElement>) => void {
	return (event: React.KeyboardEvent<HTMLDialogElement>): void => {
		if (event.key === 'Escape') {
			return;
		}
		if (
			(event.key === 'Enter' || event.key === ' ') &&
			closeOnOverlayClick &&
			event.target === event.currentTarget
		) {
			onClose();
		}
	};
}

export function createModalEventHandlers(
	closeOnOverlayClick: boolean,
	onClose: () => void
): {
	handleOverlayClick: (event: React.MouseEvent<HTMLDialogElement>) => void;
	handleOverlayKeyDown: (event: React.KeyboardEvent<HTMLDialogElement>) => void;
} {
	return {
		handleOverlayClick: createOverlayClickHandler(closeOnOverlayClick, onClose),
		handleOverlayKeyDown: createOverlayKeyDownHandler(closeOnOverlayClick, onClose),
	};
}

export function createDialogCancelHandler(closeOnEscape: boolean, onClose: () => void) {
	return (e: React.SyntheticEvent<HTMLDialogElement>): void => {
		if (closeOnEscape) {
			e.preventDefault();
			onClose();
		}
	};
}
