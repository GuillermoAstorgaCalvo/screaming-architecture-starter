import { buildPopconfirmSetup } from '@core/ui/overlays/popconfirm/helpers/Popconfirm.builders';
import {
	DEFAULT_CANCEL_LABEL,
	DEFAULT_CONFIRM_LABEL,
} from '@core/ui/overlays/popconfirm/helpers/popconfirm.constants';
import type { PopconfirmProps } from '@core/ui/overlays/popconfirm/types/popconfirm.types';
import Popover from '@core/ui/popover/Popover';

/**
 * Popconfirm - Lightweight confirmation popover (not a modal)
 *
 * Features: Accessible, flexible positioning, click outside/Escape to close,
 * automatic viewport boundary detection, portal rendering, dark mode support,
 * pre-configured action buttons, simpler API than Popover for confirmations.
 *
 * @example
 * ```tsx
 * <Popconfirm
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   trigger={<button>Delete</button>}
 *   title="Delete Item"
 *   description="Are you sure?"
 *   onConfirm={handleDelete}
 *   destructive
 * />
 * ```
 */
export default function Popconfirm(props: Readonly<PopconfirmProps>) {
	const {
		confirmLabel = DEFAULT_CONFIRM_LABEL,
		cancelLabel = DEFAULT_CANCEL_LABEL,
		destructive = false,
		showCancel = true,
		position = 'top',
		closeOnOutsideClick = true,
		closeOnEscape = true,
		...restProps
	} = props;
	const popoverProps = buildPopconfirmSetup({
		...restProps,
		confirmLabel,
		cancelLabel,
		destructive,
		showCancel,
		position,
		closeOnOutsideClick,
		closeOnEscape,
	});
	return <Popover {...popoverProps} />;
}
