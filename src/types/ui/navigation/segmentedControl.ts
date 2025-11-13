import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * SegmentedControl variant types
 */
export type SegmentedControlVariant = 'default' | 'pills' | 'outline';

/**
 * SegmentedControl item data
 */
export interface SegmentedControlItem {
	/** Unique identifier for the item */
	id: string;
	/** Item label */
	label: ReactNode;
	/** Optional icon for the item */
	icon?: ReactNode;
	/** Whether the item is disabled @default false */
	disabled?: boolean;
}

/**
 * SegmentedControl component props
 */
export interface SegmentedControlProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of segmented control items */
	items: readonly SegmentedControlItem[];
	/** ID of the currently selected item */
	value: string;
	/** Callback when selection changes */
	onValueChange: (itemId: string) => void;
	/** Visual variant of the segmented control @default 'default' */
	variant?: SegmentedControlVariant;
	/** Size of the segmented control @default 'md' */
	size?: StandardSize;
	/** Whether the segmented control is disabled @default false */
	disabled?: boolean;
	/** Optional segmented control ID for accessibility */
	segmentedControlId?: string;
}
