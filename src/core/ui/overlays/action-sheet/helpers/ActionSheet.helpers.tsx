import Backdrop from '@core/ui/backdrop/Backdrop';
import { ActionSheetContent } from '@core/ui/overlays/action-sheet/components/ActionSheet.components';
import {
	ACTION_SHEET_ACTION_BASE_CLASSES,
	ACTION_SHEET_ACTION_DEFAULT_CLASSES,
	ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES,
	ACTION_SHEET_SEPARATOR_CLASSES,
} from '@core/ui/overlays/action-sheet/helpers/ActionSheet.constants';
import { componentZIndex } from '@core/ui/theme/tokens';
import type { ActionSheetAction } from '@src-types/ui/overlays/interactions';
import type { MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

/**
 * Handles overlay click events
 */
export function handleOverlayClick(
	e: MouseEvent<HTMLDivElement>,
	closeOnOverlayClick: boolean,
	onClose: () => void
): void {
	if (closeOnOverlayClick && e.target === e.currentTarget) {
		onClose();
	}
}

/**
 * Handles action button click events
 */
export async function handleActionClick(
	action: ActionSheetAction,
	onClose: () => void
): Promise<void> {
	if (action.disabled) {
		return;
	}
	if (action.onSelect) {
		await action.onSelect();
	}
	onClose();
}

/**
 * Gets the CSS classes for an action button
 */
export function getActionClasses(action: ActionSheetAction, index: number): string {
	return twMerge(
		ACTION_SHEET_ACTION_BASE_CLASSES,
		action.destructive
			? ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES
			: ACTION_SHEET_ACTION_DEFAULT_CLASSES,
		index > 0 && ACTION_SHEET_SEPARATOR_CLASSES
	);
}

/**
 * Creates event handlers for the action sheet
 */
export function createActionSheetHandlers(
	closeOnOverlayClick: boolean,
	onClose: () => void
): {
	onOverlayClick: (e: MouseEvent<HTMLDivElement>) => void;
	onActionClick: (action: ActionSheetAction) => Promise<void>;
} {
	const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
		handleOverlayClick(e, closeOnOverlayClick, onClose);
	};

	const onActionClick = async (action: ActionSheetAction) => {
		await handleActionClick(action, onClose);
	};

	return { onOverlayClick, onActionClick };
}

interface CreateActionSheetPortalContentParams {
	id: string;
	actions: readonly ActionSheetAction[];
	cancelLabel: string;
	showCancel: boolean;
	onClose: () => void;
	onActionClick: (action: ActionSheetAction) => Promise<void>;
	onOverlayClick: (e: MouseEvent<HTMLDivElement>) => void;
	title?: string | undefined;
	className?: string | undefined;
	overlayClassName?: string | undefined;
	isOpen: boolean;
}

/**
 * Creates the portal content for the action sheet
 */
export function createActionSheetPortalContent({
	id,
	actions,
	cancelLabel,
	showCancel,
	onClose,
	onActionClick,
	onOverlayClick,
	title,
	className,
	overlayClassName,
	isOpen,
}: CreateActionSheetPortalContentParams): ReactNode {
	return createPortal(
		<>
			<Backdrop
				isOpen={isOpen}
				onClick={onOverlayClick}
				{...(overlayClassName && { className: overlayClassName })}
				zIndex={componentZIndex.modalBackdrop}
			/>
			<ActionSheetContent
				id={id}
				actions={actions}
				cancelLabel={cancelLabel}
				showCancel={showCancel}
				onClose={onClose}
				onActionClick={onActionClick}
				{...(title && { title })}
				{...(className && { className })}
			/>
		</>,
		document.body
	);
}
