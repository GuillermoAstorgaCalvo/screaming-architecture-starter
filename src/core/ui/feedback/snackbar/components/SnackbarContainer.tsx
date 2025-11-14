import { useSnackbar } from '@core/providers/snackbar/useSnackbar';
import { SNACKBAR_POSITION_CLASSES } from '@core/ui/feedback/snackbar/constants/snackbar.constants';
import Snackbar from '@core/ui/feedback/snackbar/Snackbar';
import type {
	SnackbarItem,
	SnackbarPosition,
} from '@core/ui/feedback/snackbar/types/snackbar.types';
import { classNames } from '@core/utils/classNames';
import { useEffect, useState } from 'react';

export interface SnackbarContainerProps {
	/** Position of snackbars @default 'bottom-center' */
	readonly position?: SnackbarPosition;
	/** Additional CSS classes */
	readonly className?: string;
}

/**
 * SnackbarContainer - Renders a queue of snackbar notifications
 *
 * Displays snackbars from the SnackbarProvider queue with automatic stacking,
 * positioning, and dismissal. Should be placed once in the app layout.
 * Requires SnackbarProvider to be in the component tree.
 *
 * @example
 * ```tsx
 * <SnackbarContainer position="bottom-center" />
 * ```
 */
export default function SnackbarContainer({
	position = 'bottom-center',
	className,
}: Readonly<SnackbarContainerProps>) {
	const { snackbars, dismiss } = useSnackbar();
	const [visibleSnackbars, setVisibleSnackbars] = useState<readonly SnackbarItem[]>([]);

	useEffect(() => {
		setVisibleSnackbars(snackbars);
	}, [snackbars]);

	if (visibleSnackbars.length === 0) {
		return null;
	}

	return (
		<div
			className={classNames(
				'pointer-events-none fixed z-50 flex flex-col gap-2',
				SNACKBAR_POSITION_CLASSES[position],
				className
			)}
			aria-label="Notifications"
		>
			{visibleSnackbars.map(snackbar => (
				<div key={snackbar.id} className="pointer-events-auto">
					<Snackbar
						isOpen={true}
						onDismiss={() => dismiss(snackbar.id)}
						message={snackbar.message}
						intent={snackbar.intent}
						{...(snackbar.autoDismiss !== undefined && { autoDismiss: snackbar.autoDismiss })}
						{...(snackbar.dismissAfter !== undefined && { dismissAfter: snackbar.dismissAfter })}
						{...(snackbar.action && { action: snackbar.action })}
						{...(snackbar.className && { className: snackbar.className })}
					/>
				</div>
			))}
		</div>
	);
}
