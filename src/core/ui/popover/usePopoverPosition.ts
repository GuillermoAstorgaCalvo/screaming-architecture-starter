import type { PopoverPosition } from '@src-types/ui/overlays';
import { type RefObject, useEffect, useState } from 'react';

import { calculatePopoverPosition, type PopoverPositionState } from './popoverPosition';

interface UsePopoverPositionOptions {
	readonly triggerRef: RefObject<HTMLElement | null>;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly isOpen: boolean;
	readonly position: PopoverPosition;
}

/**
 * Hook to manage popover positioning
 */
export function usePopoverPosition({
	triggerRef,
	popoverRef,
	isOpen,
	position,
}: UsePopoverPositionOptions): PopoverPositionState {
	const [popoverPosition, setPopoverPosition] = useState<PopoverPositionState>({ top: 0, left: 0 });

	useEffect(() => {
		if (!isOpen || !triggerRef.current || !popoverRef.current) {
			return;
		}

		const updatePosition = (): void => {
			if (triggerRef.current && popoverRef.current) {
				const pos = calculatePopoverPosition(triggerRef.current, popoverRef.current, position);
				setPopoverPosition(pos);
			}
		};

		updatePosition();

		const handleUpdate = (): void => {
			updatePosition();
		};

		globalThis.window.addEventListener('scroll', handleUpdate, true);
		globalThis.window.addEventListener('resize', handleUpdate);

		return () => {
			globalThis.window.removeEventListener('scroll', handleUpdate, true);
			globalThis.window.removeEventListener('resize', handleUpdate);
		};
	}, [isOpen, position, triggerRef, popoverRef]);

	return popoverPosition;
}
