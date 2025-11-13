import type { ActionSheetAction } from '@src-types/ui/overlays/interactions';
import type { MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';

import {
	ACTION_SHEET_ACTION_BASE_CLASSES,
	ACTION_SHEET_ACTION_DEFAULT_CLASSES,
	ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES,
	ACTION_SHEET_SEPARATOR_CLASSES,
} from './ActionSheet.constants';

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
