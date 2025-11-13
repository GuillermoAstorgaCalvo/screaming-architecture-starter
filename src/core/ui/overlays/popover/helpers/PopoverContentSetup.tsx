import type { ReactNode, RefObject } from 'react';

import { buildContentClasses, renderPopoverPortal } from './PopoverHelpers';
import type { PopoverPositionState } from './popoverPosition';

interface BuildPopoverContentSetupOptions {
	readonly className?: string | undefined;
	readonly isOpen: boolean;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly popoverPosition: PopoverPositionState;
	readonly id: string;
	readonly children: ReactNode;
	readonly createPortalFn: ((children: ReactNode, container: HTMLElement) => ReactNode) | undefined;
}

export function buildPopoverContentSetup({
	className,
	isOpen,
	popoverRef,
	popoverPosition,
	id,
	children,
	createPortalFn,
}: BuildPopoverContentSetupOptions) {
	const contentClasses = buildContentClasses({ className });
	return renderPopoverPortal({
		isOpen,
		popoverRef,
		popoverPosition,
		id,
		contentClasses,
		children,
		createPortalFn,
	});
}
