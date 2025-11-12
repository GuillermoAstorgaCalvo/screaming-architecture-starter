import type { ActionSheetAction } from '@src-types/ui/overlays';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import {
	ACTION_SHEET_BASE_CLASSES,
	ACTION_SHEET_CANCEL_CLASSES,
	ACTION_SHEET_CONTAINER_CLASSES,
	ACTION_SHEET_TITLE_CLASSES,
} from './ActionSheet.constants';
import { getActionClasses } from './ActionSheet.helpers';

/**
 * Renders the action sheet title
 */
export function ActionSheetTitle({ id, title }: Readonly<{ id: string; title: string }>) {
	return (
		<div id={`${id}-title`} className={ACTION_SHEET_TITLE_CLASSES}>
			{title}
		</div>
	);
}

/**
 * Renders a single action button
 */
export function ActionSheetActionButton({
	action,
	index,
	onActionClick,
}: Readonly<{
	action: ActionSheetAction;
	index: number;
	onActionClick: (action: ActionSheetAction) => void;
}>) {
	const actionClasses = getActionClasses(action, index);

	return (
		<button
			type="button"
			className={actionClasses}
			onClick={() => onActionClick(action)}
			disabled={action.disabled}
		>
			{action.icon ? <span className="shrink-0">{action.icon}</span> : null}
			<span className="flex-1">{action.label}</span>
		</button>
	);
}

/**
 * Renders the list of action buttons
 */
export function ActionSheetActions({
	actions,
	onActionClick,
}: Readonly<{
	actions: readonly ActionSheetAction[];
	onActionClick: (action: ActionSheetAction) => void;
}>) {
	return (
		<div className={ACTION_SHEET_CONTAINER_CLASSES}>
			{actions.map((action, index) => (
				<ActionSheetActionButton
					key={action.id}
					action={action}
					index={index}
					onActionClick={onActionClick}
				/>
			))}
		</div>
	);
}

/**
 * Renders the cancel button
 */
export function ActionSheetCancelButton({
	cancelLabel,
	onClose,
}: Readonly<{
	cancelLabel: string;
	onClose: () => void;
}>) {
	return (
		<button type="button" className={ACTION_SHEET_CANCEL_CLASSES} onClick={onClose}>
			{cancelLabel}
		</button>
	);
}

/**
 * Renders the action sheet content
 */
export function ActionSheetContent({
	id,
	title,
	actions,
	cancelLabel,
	showCancel,
	onClose,
	onActionClick,
	className,
}: Readonly<{
	id: string;
	title?: string;
	actions: readonly ActionSheetAction[];
	cancelLabel: string;
	showCancel: boolean;
	onClose: () => void;
	onActionClick: (action: ActionSheetAction) => void;
	className?: string;
}>) {
	const actionSheetRef = useRef<HTMLDivElement>(null);
	const actionSheetClasses = twMerge(ACTION_SHEET_BASE_CLASSES, className);

	return (
		<div
			ref={actionSheetRef}
			id={id}
			role="alertdialog"
			aria-modal="true"
			aria-labelledby={title ? `${id}-title` : undefined}
			className={actionSheetClasses}
		>
			{title ? <ActionSheetTitle id={id} title={title} /> : null}
			<ActionSheetActions actions={actions} onActionClick={onActionClick} />
			{showCancel ? <ActionSheetCancelButton cancelLabel={cancelLabel} onClose={onClose} /> : null}
		</div>
	);
}
