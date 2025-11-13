import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Transfer option/item
 */
export interface TransferOption<T = unknown> {
	/** Unique identifier for the option */
	value: string;
	/** Display label for the option */
	label: ReactNode;
	/** Optional additional data */
	data?: T;
	/** Whether the option is disabled @default false */
	disabled?: boolean;
}

/**
 * Transfer component props
 */
export interface TransferProps<T = unknown>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Available options (source list) */
	options: readonly TransferOption<T>[];
	/** Selected values (target list) - controlled */
	value?: string[];
	/** Default selected values (uncontrolled) */
	defaultValue?: string[];
	/** Callback when selection changes */
	onChange?: (selectedValues: string[]) => void;
	/** Title for the source list */
	sourceTitle?: ReactNode;
	/** Title for the target list */
	targetTitle?: ReactNode;
	/** Placeholder text for search inputs */
	searchPlaceholder?: string;
	/** Whether to show search inputs @default true */
	showSearch?: boolean;
	/** Custom filter function for search */
	filterFn?: (option: TransferOption<T>, searchValue: string) => boolean;
	/** Size of the component @default 'md' */
	size?: StandardSize;
	/** Whether the component is disabled @default false */
	disabled?: boolean;
	/** Custom renderer for list items */
	renderItem?: (option: TransferOption<T>, isSelected: boolean) => ReactNode;
	/** Custom renderer for empty state */
	renderEmpty?: (listType: 'source' | 'target') => ReactNode;
	/** Maximum height of each list in pixels @default 300 */
	maxHeight?: number;
	/** Whether to show select all/none buttons @default true */
	showSelectAll?: boolean;
	/** Custom labels for buttons */
	labels?: {
		selectAll?: string;
		selectNone?: string;
		moveToRight?: string;
		moveToLeft?: string;
	};
	/** ID for the transfer component */
	transferId?: string;
}
