import { useEscapeKey } from '@core/ui/modal/useModal';
import { type MouseEvent, type RefObject, useRef } from 'react';

import { useBodyOverflow } from './useDrawer';

export interface DrawerSetupResult {
	readonly drawerRef: RefObject<HTMLDivElement | null>;
	readonly handleOverlayClick: (
		e: MouseEvent<HTMLDivElement>,
		closeOnOverlayClick: boolean
	) => void;
}

export function useDrawerSetup(
	isOpen: boolean,
	closeOnEscape: boolean,
	onClose: () => void
): DrawerSetupResult {
	const drawerRef = useRef<HTMLDivElement>(null);

	useEscapeKey(isOpen, closeOnEscape, onClose);
	useBodyOverflow(isOpen);

	const handleOverlayClick = (e: MouseEvent<HTMLDivElement>, closeOnOverlayClick: boolean) => {
		if (closeOnOverlayClick && e.target === e.currentTarget) {
			onClose();
		}
	};

	return { drawerRef, handleOverlayClick };
}
