import type { PopoverPosition } from '@src-types/ui/overlays';
import { type RefObject, useRef } from 'react';

import { usePopoverSetup, useTriggerRef } from './PopoverHooks';
import type { UsePopoverReturn } from './usePopoverHelpers';

interface UsePopoverComponentSetupOptions {
	readonly isOpen: boolean;
	readonly position: PopoverPosition;
	readonly closeOnOutsideClick: boolean;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
	readonly popoverId: string | undefined;
}

interface UsePopoverComponentSetupReturn extends UsePopoverReturn {
	readonly triggerWrapperRef: RefObject<HTMLDivElement | null>;
}

export function usePopoverComponentSetup({
	isOpen,
	position,
	closeOnOutsideClick,
	closeOnEscape,
	onClose,
	popoverId,
}: UsePopoverComponentSetupOptions): UsePopoverComponentSetupReturn {
	const triggerWrapperRef = useRef<HTMLDivElement>(null);
	const popoverSetup = usePopoverSetup({
		isOpen,
		position,
		closeOnOutsideClick,
		closeOnEscape,
		onClose,
		popoverId,
	});

	useTriggerRef({ triggerWrapperRef, setTriggerElement: popoverSetup.setTriggerElement });

	return {
		...popoverSetup,
		triggerWrapperRef,
	};
}
