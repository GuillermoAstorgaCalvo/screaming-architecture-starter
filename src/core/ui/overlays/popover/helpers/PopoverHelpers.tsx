import { PopoverContent } from '@core/ui/overlays/popover/components/PopoverParts';
import type { PopoverPositionState } from '@core/ui/overlays/popover/helpers/popoverPosition';
import type { ReactNode, RefObject } from 'react';

interface BuildPopoverContentOptions {
	readonly isOpen: boolean;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly popoverPosition: PopoverPositionState;
	readonly id: string;
	readonly contentClasses: string;
	readonly children: ReactNode;
}

export function buildPopoverContent({
	isOpen,
	popoverRef,
	popoverPosition,
	id,
	contentClasses,
	children,
}: BuildPopoverContentOptions) {
	if (!isOpen) {
		return null;
	}

	const ref = popoverRef as RefObject<HTMLDivElement>;
	return (
		<PopoverContent popoverRef={ref} position={popoverPosition} id={id} className={contentClasses}>
			{children}
		</PopoverContent>
	);
}

interface BuildContentClassesOptions {
	readonly className?: string | undefined;
}

export function buildContentClasses({ className }: BuildContentClassesOptions): string {
	const baseClasses =
		'bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2';
	return className ? `${baseClasses} ${className}` : baseClasses;
}

interface RenderPopoverPortalOptions {
	readonly isOpen: boolean;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly popoverPosition: PopoverPositionState;
	readonly id: string;
	readonly contentClasses: string;
	readonly children: ReactNode;
	readonly createPortalFn: ((children: ReactNode, container: HTMLElement) => ReactNode) | undefined;
}

export function renderPopoverPortal({
	isOpen,
	popoverRef,
	popoverPosition,
	id,
	contentClasses,
	children,
	createPortalFn,
}: RenderPopoverPortalOptions) {
	const popoverContent = buildPopoverContent({
		isOpen,
		popoverRef,
		popoverPosition,
		id,
		contentClasses,
		children,
	});

	return createPortalFn && popoverContent ? createPortalFn(popoverContent, document.body) : null;
}
