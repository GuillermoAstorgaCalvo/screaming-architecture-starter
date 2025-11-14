import i18n from '@core/i18n/i18n';
import type { RenderSelectAllButtonProps } from '@core/ui/forms/transfer/types/TransferList.types';
import { twMerge } from 'tailwind-merge';

function getSelectAllLabel(labels: RenderSelectAllButtonProps['labels']): string {
	return labels?.selectAll ?? i18n.t('common.selectAll', { ns: 'common' });
}

function getSelectNoneLabel(labels: RenderSelectAllButtonProps['labels']): string {
	return labels?.selectNone ?? i18n.t('common.deselectAll', { ns: 'common' });
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
				'text-xs text-primary dark:text-primary-foreground hover:underline',
				disabled && 'opacity-disabled cursor-not-allowed'
			)}
			aria-label={ariaLabel}
		>
			{label}
		</button>
	);
}
