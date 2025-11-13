import { useEscapeKey, useFocusTrap, useModalFocus, useModalId } from '@core/ui/modal/useModal';
import { type KeyboardEvent, type MouseEvent, type RefObject, useRef } from 'react';

import { createDialogEventHandlers } from './DialogHelpers';

export interface DialogSetupResult {
	readonly dialogRef: RefObject<HTMLDialogElement | null>;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly handleOverlayClick: (event: MouseEvent<HTMLDialogElement>) => void;
	readonly handleOverlayKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void;
}

export function useDialogSetup(
	options: {
		readonly dialogId?: string;
		readonly closeOnOverlayClick: boolean;
		readonly onClose: () => void;
	},
	isOpen: boolean,
	closeOnEscape: boolean
): DialogSetupResult {
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const generatedId = useModalId(options.dialogId);
	const titleId = `${generatedId}-title`;
	const descriptionId = `${generatedId}-description`;

	useEscapeKey(isOpen, closeOnEscape, options.onClose);
	useModalFocus(dialogRef, isOpen);
	useFocusTrap(dialogRef, isOpen);

	const eventHandlers = createDialogEventHandlers(options.closeOnOverlayClick, options.onClose);

	return { dialogRef, titleId, descriptionId, ...eventHandlers };
}
