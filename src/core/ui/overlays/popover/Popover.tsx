import { PopoverTrigger } from '@core/ui/overlays/popover/components/PopoverTrigger';
import { buildPopoverContent } from '@core/ui/overlays/popover/helpers/PopoverContentBuilder';
import { usePopoverSetup } from '@core/ui/overlays/popover/hooks/usePopoverSetup';
import type { PopoverProps } from '@src-types/ui/overlays/floating';

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
