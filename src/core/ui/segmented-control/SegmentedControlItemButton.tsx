import {
	SEGMENTED_CONTROL_ITEM_BASE_CLASSES,
	SEGMENTED_CONTROL_ITEM_SIZE_CLASSES,
	SEGMENTED_CONTROL_ITEM_VARIANT_CLASSES,
} from '@core/constants/ui/navigation';
import type { SegmentedControlItem, SegmentedControlProps } from '@src-types/ui/navigation';
import type { KeyboardEvent } from 'react';
import { twMerge } from 'tailwind-merge';

interface SegmentedControlItemButtonProps {
	readonly item: SegmentedControlItem;
	readonly isSelected: boolean;
	readonly isDisabled: boolean;
	readonly variant: NonNullable<SegmentedControlProps['variant']>;
	readonly size: NonNullable<SegmentedControlProps['size']>;
	readonly id: string;
	readonly onValueChange: (itemId: string) => void;
	readonly onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, itemId: string) => void;
}

export function SegmentedControlItemButton({
	item,
	isSelected,
	isDisabled,
	variant,
	size,
	id,
	onValueChange,
	onKeyDown,
}: SegmentedControlItemButtonProps) {
	const itemClasses = twMerge(
		SEGMENTED_CONTROL_ITEM_BASE_CLASSES,
		SEGMENTED_CONTROL_ITEM_SIZE_CLASSES[size],
		isSelected
			? SEGMENTED_CONTROL_ITEM_VARIANT_CLASSES[variant].active
			: SEGMENTED_CONTROL_ITEM_VARIANT_CLASSES[variant].inactive,
		isDisabled && 'cursor-not-allowed'
	);

	return (
		<button
			type="button"
			role="tab"
			aria-selected={isSelected}
			aria-controls={`${id}-panel-${item.id}`}
			id={`${id}-tab-${item.id}`}
			disabled={isDisabled}
			className={itemClasses}
			onClick={() => !isDisabled && onValueChange(item.id)}
			onKeyDown={e => onKeyDown(e, item.id)}
		>
			{item.icon ? <span className="mr-1.5">{item.icon}</span> : null}
			{item.label}
		</button>
	);
}
