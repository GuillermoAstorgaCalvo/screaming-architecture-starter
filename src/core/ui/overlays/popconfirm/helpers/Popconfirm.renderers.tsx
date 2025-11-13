import Button from '@core/ui/button/Button';
import type {
	PopconfirmContentProps,
	PopconfirmFooterProps,
} from '@core/ui/overlays/popconfirm/types/popconfirm.types';
import type { ReactNode } from 'react';

/**
 * Renders the footer with cancel and confirm buttons
 */
export function renderFooter({
	showCancel,
	cancelLabel,
	confirmLabel,
	destructive,
	onCancel,
	onConfirm,
}: PopconfirmFooterProps): ReactNode {
	return (
		<div className="flex justify-end gap-2 mt-4">
			{showCancel ? (
				<Button variant="secondary" size="sm" onClick={onCancel}>
					{cancelLabel}
				</Button>
			) : null}
			<Button
				variant="primary"
				size="sm"
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
export function renderDescription(description: ReactNode | undefined): ReactNode | null {
	if (!description) {
		return null;
	}
	return <div className="text-sm text-muted-foreground mt-1">{description}</div>;
}

/**
 * Renders the popconfirm content (title, description, and footer)
 */
export function renderPopconfirmContent({
	title,
	description,
	footer,
}: PopconfirmContentProps): ReactNode {
	return (
		<div className="p-3">
			<div className="font-medium text-sm">{title}</div>
			{renderDescription(description)}
			{footer}
		</div>
	);
}
