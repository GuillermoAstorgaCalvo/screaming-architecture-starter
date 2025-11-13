import { MoveButton } from './TransferActions.button';
import type { ButtonConfig, ButtonSize } from './TransferActions.types';

/**
 * Renders the action buttons for the transfer component
 */
export function renderActionButtons(
	buttonSize: ButtonSize,
	moveToTargetConfig: ButtonConfig,
	moveToSourceConfig: ButtonConfig
) {
	return (
		<>
			<MoveButton {...moveToTargetConfig} size={buttonSize} />
			<MoveButton {...moveToSourceConfig} size={buttonSize} />
		</>
	);
}
