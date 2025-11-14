import { AlertDialogFooter } from '@core/ui/feedback/alert-dialog/components/AlertDialogComponents';
import {
	createCancelHandler,
	createConfirmHandler,
} from '@core/ui/feedback/alert-dialog/utils/AlertDialog.utils';

/**
 * Creates the footer component for the alert dialog
 */
export function createAlertDialogFooter(props: {
	showCancel: boolean;
	cancelLabel: string;
	confirmLabel: string;
	destructive: boolean;
	onConfirm: (() => void | Promise<void>) | undefined;
	onCancel: (() => void) | undefined;
	onClose: () => void;
}) {
	const handleConfirm = createConfirmHandler(props.onConfirm, props.onClose);
	const handleCancel = createCancelHandler(props.onCancel, props.onClose);
	return (
		<AlertDialogFooter
			showCancel={props.showCancel}
			cancelLabel={props.cancelLabel}
			confirmLabel={props.confirmLabel}
			destructive={props.destructive}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
		/>
	);
}
