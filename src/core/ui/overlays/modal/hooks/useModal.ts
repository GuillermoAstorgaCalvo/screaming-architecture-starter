import { focusFirstElement, handleTabNavigation, saveActiveElement } from '@core/a11y/focus/focus';
import { type RefObject, useEffect, useId, useRef } from 'react';

/**
 * Generates a unique modal ID using React's useId hook
 *
 * @param providedId - Optional custom ID to use instead of generating one
 * @returns The provided ID or a generated unique modal ID
 *
 * @example
 * ```tsx
 * const modalId = useModalId('custom-modal'); // Returns 'custom-modal'
 * const autoId = useModalId(); // Returns 'modal-:r1:'
 * ```
 */
export function useModalId(providedId: string | undefined): string {
	const reactId = useId();

	if (providedId) {
		return providedId;
	}

	// Convert React's ID format to a modal-specific ID
	return `modal-${reactId}`;
}

/**
 * Sets the initial focus on the first focusable element within the modal
 *
 * @param modal - The modal dialog element to focus within
 *
 * @internal
 */
function setModalInitialFocus(modal: HTMLDialogElement): void {
	focusFirstElement(modal);
}

/**
 * Handles opening a modal dialog with proper focus management
 *
 * Saves the previously active element, opens the modal, locks body scroll,
 * and sets focus to the first focusable element within the modal.
 *
 * @param modal - The modal dialog element to open
 * @param previousActiveElementRef - Ref to store the previously active element
 * @returns Cleanup function to restore focus and close the modal
 *
 * @internal
 */
function handleModalOpen(
	modal: HTMLDialogElement,
	previousActiveElementRef: RefObject<HTMLElement | null>
): () => void {
	previousActiveElementRef.current = saveActiveElement();
	modal.showModal();
	document.body.style.overflow = 'hidden';

	// Defer focus to next tick to ensure modal is fully rendered
	const timeoutId = setTimeout(() => {
		setModalInitialFocus(modal);
	}, 0);

	return () => {
		clearTimeout(timeoutId);
		document.body.style.overflow = '';
		modal.close();
		previousActiveElementRef.current?.focus();
	};
}

/**
 * Handles closing a modal dialog and restoring focus
 *
 * @param modal - The modal dialog element to close
 * @param previousActiveElement - The element to restore focus to
 *
 * @internal
 */
function handleModalClose(
	modal: HTMLDialogElement,
	previousActiveElement: HTMLElement | null
): void {
	document.body.style.overflow = '';
	modal.close();
	previousActiveElement?.focus();
}

/**
 * Hook to handle Escape key closing of the modal
 *
 * Listens for the Escape key when the modal is open and closes it
 * if `closeOnEscape` is enabled.
 *
 * @param isOpen - Whether the modal is currently open
 * @param closeOnEscape - Whether to close the modal on Escape key press
 * @param onClose - Callback function to close the modal
 *
 * @example
 * ```tsx
 * useEscapeKey(isOpen, true, () => setIsOpen(false));
 * ```
 */
export function useEscapeKey(isOpen: boolean, closeOnEscape: boolean, onClose: () => void): void {
	// Use ref to store the latest onClose callback to avoid stale closures
	// and prevent unnecessary effect re-runs when onClose changes
	const onCloseRef = useRef(onClose);

	// Update ref when onClose changes
	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		if (!isOpen || !closeOnEscape) {
			return;
		}

		const handleEscape = (event: globalThis.KeyboardEvent): void => {
			if (event.key === 'Escape') {
				onCloseRef.current();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, closeOnEscape]);
}

/**
 * Hook to manage focus and dialog element control
 *
 * Handles opening/closing the modal dialog element and manages focus:
 * - Saves the previously active element before opening
 * - Opens the modal and sets focus to the first focusable element
 * - Locks body scroll when modal is open
 * - Restores focus to the previous element when closing
 *
 * @param modalRef - Ref to the modal dialog element
 * @param isOpen - Whether the modal is currently open
 *
 * @example
 * ```tsx
 * const modalRef = useRef<HTMLDialogElement | null>(null);
 * useModalFocus(modalRef, isOpen);
 * ```
 */
export function useModalFocus(
	modalRef: RefObject<HTMLDialogElement | null>,
	isOpen: boolean
): void {
	const previousActiveElementRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const modal = modalRef.current;
		if (!modal) {
			return undefined;
		}

		if (isOpen) {
			return handleModalOpen(modal, previousActiveElementRef);
		}

		// Close modal and restore focus when isOpen becomes false
		handleModalClose(modal, previousActiveElementRef.current);
		return undefined;
	}, [isOpen, modalRef]);
}

/**
 * Hook to handle focus trapping within the modal
 *
 * Implements focus trapping so that Tab and Shift+Tab navigation
 * stays within the modal boundaries, wrapping around at the edges.
 *
 * @param modalRef - Ref to the modal dialog element
 * @param isOpen - Whether the modal is currently open
 *
 * @example
 * ```tsx
 * const modalRef = useRef<HTMLDialogElement | null>(null);
 * useFocusTrap(modalRef, isOpen);
 * ```
 */
export function useFocusTrap(modalRef: RefObject<HTMLDialogElement | null>, isOpen: boolean): void {
	useEffect(() => {
		const modal = modalRef.current;
		if (!isOpen || !modal) {
			return;
		}

		const handler = (event: globalThis.KeyboardEvent): void => {
			handleTabNavigation(modal, event);
		};

		document.addEventListener('keydown', handler);
		return () => {
			document.removeEventListener('keydown', handler);
		};
	}, [isOpen, modalRef]);
}
