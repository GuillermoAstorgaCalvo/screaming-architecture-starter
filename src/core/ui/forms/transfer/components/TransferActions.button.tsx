import type { MoveButtonProps } from '@core/ui/forms/transfer/types/TransferActions.types';
import IconButton from '@core/ui/icon-button/IconButton';

/**
 * Renders a move button for the transfer actions
 */
export function MoveButton({
	icon,
	onClick,
	disabled,
	size,
	ariaLabel,
	title,
}: Readonly<MoveButtonProps>) {
	return (
		<IconButton
			icon={icon}
			onClick={onClick}
			disabled={disabled}
			size={size}
			variant="default"
			aria-label={ariaLabel}
			title={title}
		/>
	);
}
