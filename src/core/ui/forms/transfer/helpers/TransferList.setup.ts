import {
	calculateAllSelected,
	createSelectAllHandler,
} from '@core/ui/forms/transfer/helpers/TransferList.helpers';
import {
	getContainerClasses,
	getHeaderClasses,
	getHeaderPadding,
	getHeaderTextSize,
	getListContainerClasses,
	getListPadding,
	getMinWidth,
} from '@core/ui/forms/transfer/helpers/TransferList.styles';
import type {
	TransferListSetup,
	TransferListSetupOptions,
} from '@core/ui/forms/transfer/types/TransferList.types';

/**
 * Sets up the transfer list by calculating IDs, classes, and derived state
 */
export function setupTransferList<T>({
	type,
	options,
	selectedValues,
	size,
	onSelectAll,
	onSelectNone,
}: TransferListSetupOptions<T>): TransferListSetup<T> {
	const searchId = `transfer-${type}-search`;
	const headerId = `transfer-${type}-header`;
	const enabledOptions = options.filter(opt => !opt.disabled);
	const allSelected = calculateAllSelected(enabledOptions, selectedValues);
	const handleSelectAllToggle = createSelectAllHandler(allSelected, onSelectAll, onSelectNone);
	const containerClasses = getContainerClasses(getMinWidth(size));
	const headerClasses = getHeaderClasses(getHeaderPadding(size), getHeaderTextSize(size));
	const listContainerClasses = getListContainerClasses(getListPadding(size));

	return {
		searchId,
		headerId,
		enabledOptions,
		allSelected,
		handleSelectAllToggle,
		containerClasses,
		headerClasses,
		listContainerClasses,
	};
}
