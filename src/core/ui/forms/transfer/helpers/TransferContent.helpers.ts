import i18n from '@core/i18n/i18n';
import type { StandardSize } from '@src-types/ui/base';
import type { TransferProps } from '@src-types/ui/data/transfer';
import { twMerge } from 'tailwind-merge';

/**
 * Gets the gap class based on the size prop
 * Uses design tokens for spacing (gap-sm = 8px, gap-md = 12px, gap-xl = 24px)
 */
export function getGapClass(size: StandardSize): string {
	if (size === 'sm') {
		return 'gap-sm';
	}
	if (size === 'lg') {
		return 'gap-xl';
	}
	return 'gap-md';
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
	if (!labels) {
		return undefined;
	}

	const result: { selectAll?: string; selectNone?: string } = {};

	if (labels.selectAll !== undefined) {
		result.selectAll = labels.selectAll;
	}
	if (labels.selectNone !== undefined) {
		result.selectNone = labels.selectNone;
	}

	return Object.keys(result).length > 0 ? result : undefined;
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
	if (!labels) {
		return undefined;
	}

	const result: { moveToRight?: string; moveToLeft?: string } = {};

	if (labels.moveToRight !== undefined) {
		result.moveToRight = labels.moveToRight;
	}
	if (labels.moveToLeft !== undefined) {
		result.moveToLeft = labels.moveToLeft;
	}

	return Object.keys(result).length > 0 ? result : undefined;
}

const DEFAULT_TRANSFER_PROPS = {
	sourceTitle: i18n.t('transfer.sourceTitle', { ns: 'common' }),
	targetTitle: i18n.t('transfer.targetTitle', { ns: 'common' }),
	searchPlaceholder: i18n.t('common.searchPlaceholder', { ns: 'common' }),
	showSearch: true,
	size: 'md' as const,
	disabled: false,
	maxHeight: 300,
	showSelectAll: true,
} as const;

/**
 * Extracts and normalizes transfer props with defaults
 */
export function extractTransferProps<T>(props: Readonly<TransferProps<T>>) {
	const {
		onChange: _onChange,
		options: _options,
		value: _value,
		defaultValue: _defaultValue,
		...restProps
	} = props;

	return {
		...DEFAULT_TRANSFER_PROPS,
		...restProps,
		restProps,
	};
}
