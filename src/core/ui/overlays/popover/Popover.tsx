import type { PopoverProps } from '@src-types/ui/overlays/floating';
import type { ReactNode, RefObject } from 'react';

import { buildPopoverContentSetup } from './PopoverContentSetup';
import type { PopoverPositionState } from './popoverPosition';
import { usePopoverComponentSetup } from './PopoverSetup';

interface PopoverTriggerProps {
	readonly triggerWrapperRef: RefObject<HTMLDivElement | null>;
	readonly containerClassName?: string | undefined;
	readonly trigger: ReactNode;
}

function PopoverTrigger({ triggerWrapperRef, containerClassName, trigger }: PopoverTriggerProps) {
	return (
		<div ref={triggerWrapperRef} className={containerClassName}>
			{trigger}
		</div>
	);
}

interface BuildPopoverContentOptions {
	readonly className?: string | undefined;
	readonly isOpen: boolean;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly popoverPosition: PopoverPositionState;
	readonly id: string;
	readonly children: ReactNode;
	readonly createPortalFn: ((children: ReactNode, container: HTMLElement) => ReactNode) | undefined;
}

function buildPopoverContent({
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

/**
 * Popover - Flexible overlay component
 *
 * Features:
 * - Accessible: proper ARIA attributes and focus management
 * - Flexible positioning: top, bottom, left, right with alignment options
 * - Click outside to close
 * - Escape key to close
 * - Automatic positioning with viewport boundary detection
 * - Portal rendering to avoid overflow issues
 * - Dark mode support
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Popover
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   trigger={<button onClick={() => setIsOpen(true)}>Open</button>}
 *   position="bottom"
 * >
 *   <div className="p-4 bg-white rounded shadow-lg">
 *     Popover content
 *   </div>
 * </Popover>
 * ```
 */
function usePopoverSetup(props: Readonly<PopoverProps>) {
	const {
		isOpen,
		onClose,
		position = 'bottom',
		closeOnOutsideClick = true,
		closeOnEscape = true,
		popoverId,
	} = props;

	return usePopoverComponentSetup({
		isOpen,
		position,
		closeOnOutsideClick,
		closeOnEscape,
		onClose,
		popoverId: popoverId ?? undefined,
	});
}

export default function Popover(props: Readonly<PopoverProps>) {
	const { children, trigger, className, containerClassName, isOpen } = props;
	const setup = usePopoverSetup(props);

	const popoverContent = buildPopoverContent({
		className: className ?? undefined,
		isOpen,
		popoverRef: setup.popoverRef,
		popoverPosition: setup.popoverPosition,
		id: setup.id,
		children,
		createPortalFn: setup.createPortal,
	});

	return (
		<>
			<PopoverTrigger
				triggerWrapperRef={setup.triggerWrapperRef}
				containerClassName={containerClassName ?? undefined}
				trigger={trigger}
			/>
			{popoverContent}
		</>
	);
}
