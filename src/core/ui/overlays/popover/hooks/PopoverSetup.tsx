import type { UsePopoverReturn } from '@core/ui/overlays/popover/helpers/usePopoverHelpers';
import { usePopoverSetup, useTriggerRef } from '@core/ui/overlays/popover/hooks/PopoverHooks';
import type { PopoverPosition } from '@src-types/ui/overlays/floating';
import { type RefObject, useRef } from 'react';

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
