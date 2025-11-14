import Button from '@core/ui/button/Button';
import type { FooterProps } from '@core/ui/feedback/alert-dialog/types/AlertDialog.types';
import type { ReactNode } from 'react';

/**
 * Renders the footer with cancel and confirm buttons
 */
export function AlertDialogFooter({
	showCancel,
	cancelLabel,
	confirmLabel,
	destructive,
	onCancel,
	onConfirm,
}: Readonly<FooterProps>) {
	return (
		<div className="flex justify-end gap-2">
			{showCancel ? (
				<Button variant="secondary" onClick={onCancel}>
					{cancelLabel}
				</Button>
			) : null}
			<Button
				variant="primary"
				className={
					destructive
						? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
						: undefined
				}
				onClick={onConfirm}
			>
				{confirmLabel}
			</Button>
		</div>
	);
}

/**
 * Renders the description content if provided
 */
export function AlertDialogDescription({
	description,
}: Readonly<{ description: ReactNode | undefined }>) {
	if (!description) {
		return null;
	}
	return <div className="text-sm text-muted-foreground">{description}</div>;
}
