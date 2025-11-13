import type { StandardSize } from '@src-types/ui/base';
import type { TransferOption } from '@src-types/ui/data/transfer';

import type { TransferListContentProps, TransferListProps } from './TransferList.types';

/**
 * Calculates if all enabled options are selected
 */
export function calculateAllSelected(
	enabledOptions: readonly TransferOption[],
	selectedValues: Set<string>
): boolean {
	return enabledOptions.length > 0 && enabledOptions.every(opt => selectedValues.has(opt.value));
}

/**
 * Creates a handler that toggles between select all and select none
 */
export function createSelectAllHandler(
	allSelected: boolean,
	onSelectAll: () => void,
	onSelectNone: () => void
) {
	return () => {
		(allSelected ? onSelectNone : onSelectAll)();
	};
}

/**
 * Default values for transfer list props
 */
const TRANSFER_LIST_DEFAULTS = {
	searchPlaceholder: 'Search...',
	showSearch: true,
	size: 'md' as StandardSize,
	disabled: false,
	maxHeight: 300,
	showSelectAll: true,
} as const;

/**
 * Extracts props with default values applied
 */
function extractPropsWithDefaults<T>(props: Readonly<TransferListProps<T>>) {
	return {
		...props,
		searchPlaceholder: props.searchPlaceholder ?? TRANSFER_LIST_DEFAULTS.searchPlaceholder,
		showSearch: props.showSearch ?? TRANSFER_LIST_DEFAULTS.showSearch,
		size: props.size ?? TRANSFER_LIST_DEFAULTS.size,
		disabled: props.disabled ?? TRANSFER_LIST_DEFAULTS.disabled,
		maxHeight: props.maxHeight ?? TRANSFER_LIST_DEFAULTS.maxHeight,
		showSelectAll: props.showSelectAll ?? TRANSFER_LIST_DEFAULTS.showSelectAll,
	};
}

/**
 * Creates normalized props for TransferListContent
 */
function createNormalizedProps<T>(
	props: ReturnType<typeof extractPropsWithDefaults<T>>
): TransferListContentProps<T> {
	return {
		type: props.type,
		options: props.options,
		selectedValues: props.selectedValues,
		searchValue: props.searchValue,
		onSearchChange: props.onSearchChange,
		onItemToggle: props.onItemToggle,
		title: props.title,
		searchPlaceholder: props.searchPlaceholder,
		showSearch: props.showSearch,
		size: props.size,
		disabled: props.disabled,
		renderItem: props.renderItem,
		renderEmpty: props.renderEmpty,
		maxHeight: props.maxHeight,
		showSelectAll: props.showSelectAll,
		labels: props.labels,
	};
}

/**
 * Creates setup props for TransferListSetup
 */
function createSetupProps<T>(props: ReturnType<typeof extractPropsWithDefaults<T>>): {
	readonly type: 'source' | 'target';
	readonly options: readonly TransferOption<T>[];
	readonly selectedValues: Set<string>;
	readonly size: StandardSize;
	readonly onSelectAll: () => void;
	readonly onSelectNone: () => void;
} {
	return {
		type: props.type,
		options: props.options,
		selectedValues: props.selectedValues,
		size: props.size,
		onSelectAll: props.onSelectAll,
		onSelectNone: props.onSelectNone,
	};
}

/**
 * Extracts and normalizes transfer list props with defaults
 */
export function extractTransferListProps<T>(props: Readonly<TransferListProps<T>>): {
	readonly normalizedProps: TransferListContentProps<T>;
	readonly setupProps: {
		readonly type: 'source' | 'target';
		readonly options: readonly TransferOption<T>[];
		readonly selectedValues: Set<string>;
		readonly size: StandardSize;
		readonly onSelectAll: () => void;
		readonly onSelectNone: () => void;
	};
} {
	const extractedProps = extractPropsWithDefaults(props);

	return {
		normalizedProps: createNormalizedProps(extractedProps),
		setupProps: createSetupProps(extractedProps),
	};
}
