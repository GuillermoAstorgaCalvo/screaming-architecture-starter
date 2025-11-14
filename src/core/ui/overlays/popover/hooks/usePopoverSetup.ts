import { usePopoverComponentSetup } from '@core/ui/overlays/popover/hooks/PopoverSetup';
import type { PopoverProps } from '@src-types/ui/overlays/floating';

/**
 * Hook to setup popover component with default props
 */
export function usePopoverSetup(
	props: Readonly<PopoverProps>
): ReturnType<typeof usePopoverComponentSetup> {
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
