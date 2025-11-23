import { useListContext } from '@core/ui/data-display/list/hooks/useListContext';
import {
	getDragHandleClasses,
	getSortableListItemClasses,
} from '@core/ui/utilities/sortable-list/helpers/SortableListHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { SortableListItemProps } from '@src-types/ui/layout/list';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';

interface DefaultDragHandleProps {
	size: StandardSize;
	disabled: boolean;
}

function DefaultDragHandle({ size, disabled }: Readonly<DefaultDragHandleProps>) {
	const classes = getDragHandleClasses({ size, disabled });
	return (
		<div className={classes} aria-hidden="true" data-testid="sortable-list-item-drag-handle">
			<GripVertical className="w-full h-full" />
		</div>
	);
}

type AriaSetSize = string | number | undefined;

interface ExtractDataAttributesResult {
	dataTestId: string | undefined;
	ariaSetSize: AriaSetSize;
}

function extractDataAttributes(
	props: Record<string, unknown>
): Readonly<ExtractDataAttributesResult> {
	return {
		dataTestId: props['data-testid'] as string | undefined,
		ariaSetSize: props['aria-setsize'] as AriaSetSize,
	};
}

interface GetDragHandleParams {
	dragHandle: ReactNode | undefined;
	showDragHandle: boolean;
	size: StandardSize;
	disabled: boolean;
}

function getDragHandle({
	dragHandle,
	showDragHandle,
	size,
	disabled,
}: Readonly<GetDragHandleParams>): ReactNode | null {
	return (
		dragHandle ?? (showDragHandle ? <DefaultDragHandle size={size} disabled={disabled} /> : null)
	);
}

function getAriaLabel(index: number, ariaSetSize: AriaSetSize): string {
	return `Item ${index + 1} of ${ariaSetSize ?? 'unknown'}`;
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

	const { dataTestId, ariaSetSize } = extractDataAttributes(props as Record<string, unknown>);
	const handle = getDragHandle({ dragHandle, showDragHandle, size, disabled });
	const ariaLabel = getAriaLabel(index, ariaSetSize);

	return (
		<li
			{...props}
			data-testid={dataTestId ?? `sortable-list-item-${itemId}`}
			data-sortable-item-id={itemId}
			data-sortable-item-index={index}
			className={itemClasses}
			draggable={!disabled}
			tabIndex={disabled ? -1 : 0}
			aria-label={ariaLabel}
		>
			{handle}
			<div className="flex-1">{children}</div>
		</li>
	);
}
