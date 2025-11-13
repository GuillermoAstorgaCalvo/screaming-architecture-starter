import { useEscapeKey } from '@core/ui/overlays/modal/hooks/useModal';
import { useBodyOverflow } from '@core/ui/overlays/sheet/hooks/useSheet';
import { type MouseEvent, type RefObject, useRef } from 'react';

export interface SheetSetupResult {
	readonly sheetRef: RefObject<HTMLDivElement | null>;
	readonly handleOverlayClick: (
		e: MouseEvent<HTMLDivElement>,
		closeOnOverlayClick: boolean
	) => void;
}

export function useSheetSetup(
	isOpen: boolean,
	closeOnEscape: boolean,
	onClose: () => void
): SheetSetupResult {
	const sheetRef = useRef<HTMLDivElement>(null);

	useEscapeKey(isOpen, closeOnEscape, onClose);
	useBodyOverflow(isOpen);

	const handleOverlayClick = (e: MouseEvent<HTMLDivElement>, closeOnOverlayClick: boolean) => {
		if (closeOnOverlayClick && e.target === e.currentTarget) {
			onClose();
		}
	};

	return { sheetRef, handleOverlayClick };
}
