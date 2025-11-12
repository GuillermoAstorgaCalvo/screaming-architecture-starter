import type { StandardSize } from '@src-types/ui/base';
import type { TransferProps } from '@src-types/ui/data';
import { twMerge } from 'tailwind-merge';

/**
 * Gets the gap class based on the size prop
 */
export function getGapClass(size: StandardSize): string {
	if (size === 'sm') {
		return 'gap-2';
	}
	if (size === 'lg') {
		return 'gap-6';
	}
	return 'gap-4';
}

/**
 * Gets the container classes for the transfer component
 */
export function getContainerClasses(size: StandardSize, className?: string): string {
	const gapClass = getGapClass(size);
	return twMerge('flex', gapClass, className);
}

/**
 * Extracts list labels (selectAll/selectNone) from the labels prop
 */
export function getListLabels(labels?: TransferProps<unknown>['labels']):
	| {
			selectAll?: string;
			selectNone?: string;
	  }
	| undefined {
	if (labels?.selectAll === undefined && labels?.selectNone === undefined) {
		return undefined;
	}

	return {
		...(labels.selectAll !== undefined && { selectAll: labels.selectAll }),
		...(labels.selectNone !== undefined && { selectNone: labels.selectNone }),
	} as const;
}

/**
 * Extracts action labels (moveToRight/moveToLeft) from the labels prop
 */
export function getActionLabels(labels?: TransferProps<unknown>['labels']):
	| {
			moveToRight?: string;
			moveToLeft?: string;
	  }
	| undefined {
	if (labels?.moveToRight === undefined && labels?.moveToLeft === undefined) {
		return undefined;
	}

	return {
		...(labels.moveToRight !== undefined && { moveToRight: labels.moveToRight }),
		...(labels.moveToLeft !== undefined && { moveToLeft: labels.moveToLeft }),
	} as const;
}

/**
 * Extracts and normalizes transfer props with defaults
 */
export function extractTransferProps<T>(props: Readonly<TransferProps<T>>) {
	const {
		sourceTitle = 'Available',
		targetTitle = 'Selected',
		searchPlaceholder = 'Search...',
		showSearch = true,
		size = 'md',
		disabled = false,
		renderItem,
		renderEmpty,
		maxHeight = 300,
		showSelectAll = true,
		labels,
		transferId,
		className,
		onChange: _onChange,
		options: _options,
		value: _value,
		defaultValue: _defaultValue,
		...restProps
	} = props;

	return {
		sourceTitle,
		targetTitle,
		searchPlaceholder,
		showSearch,
		size,
		disabled,
		renderItem,
		renderEmpty,
		maxHeight,
		showSelectAll,
		labels,
		transferId,
		className,
		restProps,
	};
}
