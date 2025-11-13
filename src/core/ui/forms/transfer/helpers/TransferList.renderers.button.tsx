import type { RenderSelectAllButtonProps } from '@core/ui/forms/transfer/types/TransferList.types';
import { twMerge } from 'tailwind-merge';

function getSelectAllLabel(labels: RenderSelectAllButtonProps['labels']): string {
	return labels?.selectAll ?? 'Select all';
}

function getSelectNoneLabel(labels: RenderSelectAllButtonProps['labels']): string {
	return labels?.selectNone ?? 'Deselect all';
}

function getSelectAllAriaLabel(labels: RenderSelectAllButtonProps['labels']): string | undefined {
	return labels?.selectAll;
}

function getSelectNoneAriaLabel(labels: RenderSelectAllButtonProps['labels']): string | undefined {
	return labels?.selectNone;
}

/**
 * Renders the select all/none button
 */
export function renderSelectAllButton({
	allSelected,
	disabled,
	labels,
	onSelectAllToggle,
}: RenderSelectAllButtonProps) {
	const label = allSelected ? getSelectNoneLabel(labels) : getSelectAllLabel(labels);
	const ariaLabel = allSelected ? getSelectNoneAriaLabel(labels) : getSelectAllAriaLabel(labels);

	return (
		<button
			type="button"
			onClick={onSelectAllToggle}
			disabled={disabled}
			className={twMerge(
				'text-xs text-blue-600 dark:text-blue-400 hover:underline',
				disabled && 'opacity-50 cursor-not-allowed'
			)}
			aria-label={ariaLabel}
		>
			{label}
		</button>
	);
}
