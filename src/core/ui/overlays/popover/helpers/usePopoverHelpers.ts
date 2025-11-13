import type { PopoverPositionState } from '@core/ui/overlays/popover/helpers/popoverPosition';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';

export interface UsePopoverReturn {
	readonly triggerRef: RefObject<HTMLElement | null>;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly popoverPosition: PopoverPositionState;
	readonly id: string;
	readonly createPortal: typeof createPortal | undefined;
	readonly setTriggerElement: (element: HTMLElement | null) => void;
}

interface BuildUsePopoverReturnOptions {
	readonly triggerRef: RefObject<HTMLElement | null>;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly popoverPosition: PopoverPositionState;
	readonly id: string;
	readonly isOpen: boolean;
}

export function buildUsePopoverReturn({
	triggerRef,
	popoverRef,
	popoverPosition,
	id,
	isOpen,
}: BuildUsePopoverReturnOptions): UsePopoverReturn {
	const portalFn = isOpen ? createPortal : undefined;

	const setTriggerElement = (element: HTMLElement | null): void => {
		triggerRef.current = element;
	};

	return {
		triggerRef,
		popoverRef,
		popoverPosition,
		id,
		createPortal: portalFn,
		setTriggerElement,
	};
}
