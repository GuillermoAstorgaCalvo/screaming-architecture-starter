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

interface ModalHeaderProps {
	readonly titleId: string;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly onClose: () => void;
}

export function ModalHeader({ titleId, title, showCloseButton, onClose }: ModalHeaderProps) {
	return (
		<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
			<h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
				{title}
			</h2>
			{Boolean(showCloseButton) && <CloseButton onClose={onClose} />}
		</div>
	);
}

interface ModalContentProps {
	readonly descriptionId: string;
	readonly children: ReactNode;
}

export function ModalContent({ descriptionId, children }: ModalContentProps) {
	return (
		<div
			id={descriptionId}
			data-testid="modal-content"
			className="px-6 py-4 text-gray-700 dark:text-gray-300"
		>
			{children}
		</div>
	);
}

interface ModalFooterProps {
	readonly footer: ReactNode;
}

export function ModalFooter({ footer }: ModalFooterProps) {
	return <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">{footer}</div>;
}
