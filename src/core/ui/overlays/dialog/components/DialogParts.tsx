import { ARIA_LABELS } from '@core/constants/aria';
import IconButton from '@core/ui/icon-button/IconButton';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';
import type { ReactNode } from 'react';

export function CloseButton({ onClose }: { readonly onClose: () => void }) {
	return (
		<IconButton
			icon={<CloseIcon />}
			aria-label={ARIA_LABELS.CLOSE_MODAL}
			onClick={onClose}
			size="md"
		/>
	);
}

interface DialogHeaderProps {
	readonly titleId: string;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly onClose: () => void;
}

export function DialogHeader({ titleId, title, showCloseButton, onClose }: DialogHeaderProps) {
	return (
		<div className="flex items-center justify-between border-b border-border px-6 py-4 dark:border-border">
			<h2 id={titleId} className="text-lg font-semibold text-text-primary dark:text-text-primary">
				{title}
			</h2>
			{Boolean(showCloseButton) && <CloseButton onClose={onClose} />}
		</div>
	);
}

interface DialogContentProps {
	readonly descriptionId: string;
	readonly children: ReactNode;
}

export function DialogContent({ descriptionId, children }: DialogContentProps) {
	return (
		<div
			id={descriptionId}
			data-testid="dialog-content"
			className="px-6 py-4 text-text-secondary dark:text-text-secondary"
		>
			{children}
		</div>
	);
}

interface DialogFooterProps {
	readonly footer: ReactNode;
}

export function DialogFooter({ footer }: DialogFooterProps) {
	return <div className="border-t border-border px-6 py-4 dark:border-border">{footer}</div>;
}
