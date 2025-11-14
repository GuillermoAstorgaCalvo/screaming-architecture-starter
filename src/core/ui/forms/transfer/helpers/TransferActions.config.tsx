import i18n from '@core/i18n/i18n';
import type {
	ButtonConfig,
	ButtonConfigOptions,
} from '@core/ui/forms/transfer/types/TransferActions.types';
import ArrowLeftIcon from '@core/ui/icons/arrow-left-icon/ArrowLeftIcon';
import ArrowRightIcon from '@core/ui/icons/arrow-right-icon/ArrowRightIcon';

/**
 * Creates the configuration for the move to target button
 */
export function createMoveToTargetButtonConfig({
	buttonSize,
	onClick,
	disabled,
	label,
}: Readonly<ButtonConfigOptions>): ButtonConfig {
	const defaultLabel = i18n.t('transfer.moveSelectedToRight', { ns: 'common' });
	return {
		icon: <ArrowRightIcon size={buttonSize} />,
		onClick,
		disabled,
		ariaLabel: label ?? defaultLabel,
		title: label ?? defaultLabel,
	};
}

/**
 * Creates the configuration for the move to source button
 */
export function createMoveToSourceButtonConfig({
	buttonSize,
	onClick,
	disabled,
	label,
}: Readonly<ButtonConfigOptions>): ButtonConfig {
	const defaultLabel = i18n.t('transfer.moveSelectedToLeft', { ns: 'common' });
	return {
		icon: <ArrowLeftIcon size={buttonSize} />,
		onClick,
		disabled,
		ariaLabel: label ?? defaultLabel,
		title: label ?? defaultLabel,
	};
}
