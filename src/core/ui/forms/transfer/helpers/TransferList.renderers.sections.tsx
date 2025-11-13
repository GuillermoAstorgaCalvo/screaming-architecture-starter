import { renderHeader } from '@core/ui/forms/transfer/helpers/TransferList.renderers.header';
import { renderList } from '@core/ui/forms/transfer/helpers/TransferList.renderers.list';
import { renderSearch } from '@core/ui/forms/transfer/helpers/TransferList.renderers.search';
import type {
	TransferListContentProps,
	TransferListSetup,
} from '@core/ui/forms/transfer/types/TransferList.types';

/**
 * Renders the header section with extracted props
 */
export function renderHeaderSection<T>(
	setup: TransferListSetup<T>,
	props: TransferListContentProps<T>
) {
	return renderHeader({
		headerId: setup.headerId,
		headerClasses: setup.headerClasses,
		title: props.title,
		showSelectAll: props.showSelectAll,
		enabledOptionsCount: setup.enabledOptions.length,
		allSelected: setup.allSelected,
		disabled: props.disabled,
		labels: props.labels,
		onSelectAllToggle: setup.handleSelectAllToggle,
	});
}

/**
 * Renders the search section with extracted props
 */
export function renderSearchSection<T>(
	setup: TransferListSetup<T>,
	props: TransferListContentProps<T>
) {
	return renderSearch({
		showSearch: props.showSearch,
		searchId: setup.searchId,
		searchPlaceholder: props.searchPlaceholder,
		searchValue: props.searchValue,
		onSearchChange: props.onSearchChange,
		disabled: props.disabled,
		size: props.size,
		type: props.type,
	});
}

/**
 * Renders the list section with extracted props
 */
export function renderListSection<T>(
	setup: TransferListSetup<T>,
	props: TransferListContentProps<T>
) {
	return renderList({
		options: props.options,
		selectedValues: props.selectedValues,
		headerId: setup.headerId,
		listContainerClasses: setup.listContainerClasses,
		maxHeight: props.maxHeight,
		size: props.size,
		disabled: props.disabled,
		renderItem: props.renderItem,
		renderEmpty: props.renderEmpty,
		type: props.type,
		onItemToggle: props.onItemToggle,
	});
}
