import type { PopoverPosition } from '@src-types/ui/overlays/floating';
import { type RefObject, useEffect } from 'react';

import { usePopover } from './usePopover';

interface UsePopoverSetupOptions {
	readonly isOpen: boolean;
	readonly position: PopoverPosition;
	readonly closeOnOutsideClick: boolean;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
	readonly popoverId: string | undefined;
}

export function usePopoverSetup({
	isOpen,
	position,
	closeOnOutsideClick,
	closeOnEscape,
	onClose,
	popoverId,
}: UsePopoverSetupOptions) {
	return usePopover({
		isOpen,
		position,
		closeOnOutsideClick,
		closeOnEscape,
		onClose,
		popoverId,
	});
}

interface UseTriggerRefOptions {
	readonly triggerWrapperRef: RefObject<HTMLDivElement | null>;
	readonly setTriggerElement: (element: HTMLElement | null) => void;
}

/**
 * Hook to set trigger element from wrapper
 */
export function useTriggerRef({
	triggerWrapperRef,
	setTriggerElement,
}: UseTriggerRefOptions): void {
	useEffect(() => {
		const { current } = triggerWrapperRef;
		if (current) {
			const firstChild = current.firstElementChild;
			if (firstChild instanceof HTMLElement) {
				setTriggerElement(firstChild);
			}
		}
	}, [triggerWrapperRef, setTriggerElement]);
}
