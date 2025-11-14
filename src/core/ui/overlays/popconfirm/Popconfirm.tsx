import { useTranslation } from '@core/i18n/useTranslation';
import { buildPopconfirmSetup } from '@core/ui/overlays/popconfirm/helpers/Popconfirm.builders';
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
	const { t } = useTranslation('common');
	const {
		confirmLabel,
		cancelLabel,
		destructive = false,
		showCancel = true,
		position = 'top',
		closeOnOutsideClick = true,
		closeOnEscape = true,
		...restProps
	} = props;
	const defaultConfirmLabel = confirmLabel ?? t('confirm');
	const defaultCancelLabel = cancelLabel ?? t('cancel');

	const popoverProps = buildPopconfirmSetup({
		...restProps,
		confirmLabel: defaultConfirmLabel,
		cancelLabel: defaultCancelLabel,
		destructive,
		showCancel,
		position,
		closeOnOutsideClick,
		closeOnEscape,
	});
	return <Popover {...popoverProps} />;
}
