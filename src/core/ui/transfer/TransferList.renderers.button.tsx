import { twMerge } from 'tailwind-merge';

import type { RenderSelectAllButtonProps } from './TransferList.types';

/**
 * Renders the select all/none button
 */
export function renderSelectAllButton({
	allSelected,
	disabled,
	labels,
	onSelectAllToggle,
}: RenderSelectAllButtonProps) {
	const label = allSelected
		? (labels?.selectNone ?? 'Deselect all')
		: (labels?.selectAll ?? 'Select all');
	const ariaLabel = allSelected ? labels?.selectNone : labels?.selectAll;

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
