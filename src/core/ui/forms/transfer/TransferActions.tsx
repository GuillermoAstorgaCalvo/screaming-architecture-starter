import Flex from '@core/ui/flex/Flex';

import {
	createMoveToSourceButtonConfig,
	createMoveToTargetButtonConfig,
} from './TransferActions.config';
import { renderActionButtons } from './TransferActions.helpers';
import type { TransferActionsProps } from './TransferActions.types';
import { getButtonSize, getContainerClasses, getGapClass } from './TransferActions.utils';

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
