import { useBodyOverflow } from '@core/ui/overlays/drawer/hooks/useDrawer';
import { useEscapeKey } from '@core/ui/overlays/modal/hooks/useModal';
import { type MouseEvent, type RefObject, useRef } from 'react';

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
