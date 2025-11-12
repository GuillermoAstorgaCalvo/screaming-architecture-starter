import { ARIA_LABELS } from '@core/constants/aria';
import IconButton from '@core/ui/icon-button/IconButton';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';
import type { MouseEvent, ReactNode } from 'react';

import { getOverlayClasses } from './DrawerHelpers';

export function DrawerTitle({ id, title }: { readonly id: string; readonly title: string }) {
	return (
		<h2 id={`${id}-title`} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
			{title}
		</h2>
	);
}

export function DrawerCloseButton({ onClose }: { readonly onClose: () => void }) {
	return (
		<IconButton
			icon={<CloseIcon />}
			aria-label={ARIA_LABELS.CLOSE_DRAWER}
			onClick={onClose}
			variant="ghost"
			size="sm"
		/>
	);
}

interface DrawerHeaderProps {
	readonly id: string;
	readonly title?: string;
	readonly showCloseButton: boolean;
	readonly onClose: () => void;
}

export function DrawerHeader({ id, title, showCloseButton, onClose }: DrawerHeaderProps) {
	if (!title && !showCloseButton) {
		return null;
	}

	return (
		<div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
			{title ? <DrawerTitle id={id} title={title} /> : null}
			{showCloseButton ? <DrawerCloseButton onClose={onClose} /> : null}
		</div>
	);
}

export function DrawerFooter({ footer }: { readonly footer?: ReactNode }) {
	if (!footer) return null;
	return <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">{footer}</div>;
}

export function DrawerMainContent({ children }: { readonly children: ReactNode }) {
	return <div className="flex-1 overflow-y-auto">{children}</div>;
}

interface DrawerOverlayProps {
	readonly isOpen: boolean;
	readonly overlayClassName?: string;
	readonly onClick: (e: MouseEvent<HTMLDivElement>) => void;
}

export function DrawerOverlay({ isOpen, overlayClassName, onClick }: DrawerOverlayProps) {
	return (
		<div
			className={getOverlayClasses(isOpen, overlayClassName)}
			onClick={onClick}
			aria-hidden="true"
		/>
	);
}
