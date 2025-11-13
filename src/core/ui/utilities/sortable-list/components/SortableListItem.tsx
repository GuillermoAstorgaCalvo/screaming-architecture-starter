import { useListContext } from '@core/ui/data-display/list/hooks/useListContext';
import {
	getDragHandleClasses,
	getSortableListItemClasses,
} from '@core/ui/utilities/sortable-list/helpers/SortableListHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { SortableListItemProps } from '@src-types/ui/layout/list';
import { GripVertical } from 'lucide-react';

interface DefaultDragHandleProps {
	size: StandardSize;
	disabled: boolean;
}

function DefaultDragHandle({ size, disabled }: Readonly<DefaultDragHandleProps>) {
	const classes = getDragHandleClasses({ size, disabled });
	return (
		<div className={classes} aria-hidden="true">
			<GripVertical className="w-full h-full" />
		</div>
	);
}

/**
 * SortableListItem - Individual sortable list item component
 *
 * Features:
 * - Drag-and-drop support
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Visual feedback during dragging
 * - Accessible ARIA attributes
 * - Customizable drag handle
 */
export default function SortableListItem({
	children,
	itemId,
	index,
	isDragging = false,
	isDragTarget = false,
	showDragHandle = true,
	dragHandle,
	disabled = false,
	className,
	...props
}: Readonly<SortableListItemProps>) {
	const { size } = useListContext();
	const itemClasses = getSortableListItemClasses({
		size,
		isDragging,
		isDragTarget,
		disabled,
		className,
	});

	const handle =
		dragHandle ?? (showDragHandle ? <DefaultDragHandle size={size} disabled={disabled} /> : null);

	return (
		<li
			{...props}
			data-sortable-item-id={itemId}
			data-sortable-item-index={index}
			className={itemClasses}
			draggable={!disabled}
			tabIndex={disabled ? -1 : 0}
			aria-label={`Item ${index + 1} of ${props['aria-setsize'] ?? 'unknown'}`}
		>
			{handle}
			<div className="flex-1">{children}</div>
		</li>
	);
}
