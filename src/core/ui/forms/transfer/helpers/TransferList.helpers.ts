import i18n from '@core/i18n/i18n';
import type {
	TransferListContentProps,
	TransferListProps,
} from '@core/ui/forms/transfer/types/TransferList.types';
import type { StandardSize } from '@src-types/ui/base';
import type { TransferOption } from '@src-types/ui/data/transfer';

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
	searchPlaceholder: i18n.t('common.searchPlaceholder', { ns: 'common' }),
	showSearch: true,
	size: 'md' as StandardSize,
	disabled: false,
	maxHeight: 300,
	showSelectAll: true,
} as const;

/**
 * Type representing TransferListProps with defaults applied
 */
type TransferListPropsWithDefaults<T> = Omit<
	TransferListProps<T>,
	keyof typeof TRANSFER_LIST_DEFAULTS
> & {
	readonly searchPlaceholder: string;
	readonly showSearch: boolean;
	readonly size: StandardSize;
	readonly disabled: boolean;
	readonly maxHeight: number;
	readonly showSelectAll: boolean;
};

/**
 * Applies a default value if the property is null or undefined
 */
function applyDefault<K extends keyof typeof TRANSFER_LIST_DEFAULTS>(
	result: Record<string, unknown>,
	key: K,
	defaultValue: (typeof TRANSFER_LIST_DEFAULTS)[K]
): void {
	result[key] ??= defaultValue;
}

/**
 * Extracts props with default values applied
 */
function extractPropsWithDefaults<T>(
	props: Readonly<TransferListProps<T>>
): TransferListPropsWithDefaults<T> {
	const result = { ...props } as TransferListPropsWithDefaults<T>;
	const defaults = TRANSFER_LIST_DEFAULTS;

	applyDefault(result, 'searchPlaceholder', defaults.searchPlaceholder);
	applyDefault(result, 'showSearch', defaults.showSearch);
	applyDefault(result, 'size', defaults.size);
	applyDefault(result, 'disabled', defaults.disabled);
	applyDefault(result, 'maxHeight', defaults.maxHeight);
	applyDefault(result, 'showSelectAll', defaults.showSelectAll);

	return result;
}

/**
 * Creates normalized props for TransferListContent
 */
function createNormalizedProps<T>(
	props: TransferListPropsWithDefaults<T>
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
function createSetupProps<T>(props: TransferListPropsWithDefaults<T>): {
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
