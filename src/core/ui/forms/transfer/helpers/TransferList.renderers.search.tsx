import i18n from '@core/i18n/i18n';
import type { RenderSearchProps } from '@core/ui/forms/transfer/types/TransferList.types';
import Input from '@core/ui/input/Input';

/**
 * Renders the search input
 */
export function renderSearch({
	showSearch,
	searchId,
	searchPlaceholder,
	searchValue,
	onSearchChange,
	disabled,
	size,
	type,
}: RenderSearchProps) {
	if (!showSearch) {
		return null;
	}

	const searchAriaLabel = i18n.t('transfer.searchList', { ns: 'common', type });

	return (
		<div className="px-3 py-2 border-b border-border dark:border-border">
			<Input
				id={searchId}
				placeholder={searchPlaceholder}
				value={searchValue}
				onChange={e => onSearchChange(e.target.value)}
				disabled={disabled}
				size={size}
				fullWidth
				aria-label={searchAriaLabel}
			/>
		</div>
	);
}
