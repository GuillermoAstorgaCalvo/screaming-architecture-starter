import { createModalEventHandlers } from '@core/ui/overlays/modal/helpers/ModalHelpers';
import {
	useEscapeKey,
	useFocusTrap,
	useModalFocus,
	useModalId,
} from '@core/ui/overlays/modal/hooks/useModal';
import { type KeyboardEvent, type MouseEvent, type RefObject, useRef } from 'react';

export interface ModalSetupResult {
	readonly modalRef: RefObject<HTMLDialogElement | null>;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly handleOverlayClick: (event: MouseEvent<HTMLDialogElement>) => void;
	readonly handleOverlayKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void;
}

export function useModalSetup(
	options: {
		readonly modalId?: string;
		readonly closeOnOverlayClick: boolean;
		readonly onClose: () => void;
	},
	isOpen: boolean,
	closeOnEscape: boolean
): ModalSetupResult {
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const generatedId = useModalId(options.modalId);
	const titleId = `${generatedId}-title`;
	const descriptionId = `${generatedId}-description`;

	useEscapeKey(isOpen, closeOnEscape, options.onClose);
	useModalFocus(modalRef, isOpen);
	useFocusTrap(modalRef, isOpen);

	const eventHandlers = createModalEventHandlers(options.closeOnOverlayClick, options.onClose);

	return { modalRef, titleId, descriptionId, ...eventHandlers };
}
