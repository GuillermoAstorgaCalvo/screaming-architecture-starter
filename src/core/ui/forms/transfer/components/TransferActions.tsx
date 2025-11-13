import Flex from '@core/ui/flex/Flex';
import {
	createMoveToSourceButtonConfig,
	createMoveToTargetButtonConfig,
} from '@core/ui/forms/transfer/helpers/TransferActions.config';
import { renderActionButtons } from '@core/ui/forms/transfer/helpers/TransferActions.helpers';
import {
	getButtonSize,
	getContainerClasses,
	getGapClass,
} from '@core/ui/forms/transfer/helpers/TransferActions.utils';
import type { TransferActionsProps } from '@core/ui/forms/transfer/types/TransferActions.types';

/**
 * TransferActions - Action buttons for moving items between lists
 */
export function TransferActions({
	onMoveToTarget,
	onMoveToSource,
	isMoveToTargetDisabled,
	isMoveToSourceDisabled,
	size = 'md',
	disabled = false,
	labels,
}: Readonly<TransferActionsProps>) {
	const buttonSize = getButtonSize(size);
	const gapClass = getGapClass(size);
	const containerClasses = getContainerClasses(gapClass);

	const moveToTargetConfig = createMoveToTargetButtonConfig({
		buttonSize,
		onClick: onMoveToTarget,
		disabled: isMoveToTargetDisabled || disabled,
		label: labels?.moveToRight,
	});

	const moveToSourceConfig = createMoveToSourceButtonConfig({
		buttonSize,
		onClick: onMoveToSource,
		disabled: isMoveToSourceDisabled || disabled,
		label: labels?.moveToLeft,
	});

	const actionButtons = renderActionButtons(buttonSize, moveToTargetConfig, moveToSourceConfig);

	return (
		<Flex direction="col" gap="sm" align="center" justify="center" className={containerClasses}>
			{actionButtons}
		</Flex>
	);
}
