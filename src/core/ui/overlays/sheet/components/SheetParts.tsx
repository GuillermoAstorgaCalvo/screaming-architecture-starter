import { ARIA_LABELS } from '@core/constants/aria';
import IconButton from '@core/ui/icon-button/IconButton';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';
import { getOverlayClasses } from '@core/ui/overlays/sheet/helpers/SheetHelpers';
import type { MouseEvent, ReactNode } from 'react';

export function SheetTitle({ id, title }: { readonly id: string; readonly title: string }) {
	return (
		<h2 id={`${id}-title`} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
			{title}
		</h2>
	);
}

export function SheetCloseButton({ onClose }: { readonly onClose: () => void }) {
	return (
		<IconButton
			icon={<CloseIcon />}
			aria-label={ARIA_LABELS.CLOSE_SHEET}
			onClick={onClose}
			variant="ghost"
			size="sm"
		/>
	);
}

interface SheetHeaderProps {
	readonly id: string;
	readonly title?: string;
	readonly showCloseButton: boolean;
	readonly onClose: () => void;
}

export function SheetHeader({ id, title, showCloseButton, onClose }: SheetHeaderProps) {
	if (!title && !showCloseButton) {
		return null;
	}

	return (
		<div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
			{title ? <SheetTitle id={id} title={title} /> : null}
			{showCloseButton ? <SheetCloseButton onClose={onClose} /> : null}
		</div>
	);
}

export function SheetFooter({ footer }: { readonly footer?: ReactNode }) {
	if (!footer) return null;
	return <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">{footer}</div>;
}

export function SheetMainContent({ children }: { readonly children: ReactNode }) {
	return <div className="flex-1 overflow-y-auto p-4">{children}</div>;
}

interface SheetOverlayProps {
	readonly isOpen: boolean;
	readonly overlayClassName?: string;
	readonly onClick: (e: MouseEvent<HTMLDivElement>) => void;
}

export function SheetOverlay({ isOpen, overlayClassName, onClick }: SheetOverlayProps) {
	return (
		<div
			className={getOverlayClasses(isOpen, overlayClassName)}
			onClick={onClick}
			aria-hidden="true"
		/>
	);
}
