import { buildPopoverContentSetup } from '@core/ui/overlays/popover/helpers/PopoverContentSetup';
import type { PopoverPositionState } from '@core/ui/overlays/popover/helpers/popoverPosition';
import type { ReactNode, RefObject } from 'react';

export interface BuildPopoverContentOptions {
	readonly className?: string | undefined;
	readonly isOpen: boolean;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly popoverPosition: PopoverPositionState;
	readonly id: string;
	readonly children: ReactNode;
	readonly createPortalFn: ((children: ReactNode, container: HTMLElement) => ReactNode) | undefined;
}

export function buildPopoverContent({
	className,
	isOpen,
	popoverRef,
	popoverPosition,
	id,
	children,
	createPortalFn,
}: BuildPopoverContentOptions) {
	return buildPopoverContentSetup({
		className,
		isOpen,
		popoverRef,
		popoverPosition,
		id,
		children,
		createPortalFn,
	});
}
