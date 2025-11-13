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

	return (
		<div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
			<Input
				id={searchId}
				placeholder={searchPlaceholder}
				value={searchValue}
				onChange={e => onSearchChange(e.target.value)}
				disabled={disabled}
				size={size}
				fullWidth
				aria-label={`Search ${type} list`}
			/>
		</div>
	);
}
