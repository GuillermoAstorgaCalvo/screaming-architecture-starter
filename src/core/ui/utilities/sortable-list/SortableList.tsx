import { ListProvider } from '@core/ui/data-display/list/providers/ListProvider';
import {
	prepareItemHandlers,
	useSortableListConfig,
} from '@core/ui/utilities/sortable-list/helpers/SortableListHelpers';
import { renderSortableItems } from '@core/ui/utilities/sortable-list/helpers/SortableListRenderers';
import { getListVariantClasses } from '@core/ui/variants/list';
import type { SortableListProps } from '@src-types/ui/layout/list';
import { useId } from 'react';

/**
 * SortableList - Drag-and-drop sortable list component
 *
 * Features:
 * - Drag-and-drop reordering
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Visual feedback during dragging
 * - Multiple variants: default, bordered, divided
 * - Size variants: sm, md, lg
 * - Customizable drag handle
 * - Accessible ARIA attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <SortableList
 *   items={[
 *     { id: '1', data: 'Item 1' },
 *     { id: '2', data: 'Item 2' },
 *   ]}
 *   renderItem={(item) => <div>{item.data}</div>}
 *   onReorder={(items) => setItems(items)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <SortableList
 *   items={items}
 *   renderItem={(item, index) => (
 *     <div>
 *       <h3>{item.data.title}</h3>
 *       <p>{item.data.description}</p>
 *     </div>
 *   )}
 *   onReorder={handleReorder}
 *   variant="bordered"
 *   size="lg"
 *   showDragHandle={true}
 * />
 * ```
 */
export default function SortableList<T = unknown>({
	items,
	renderItem,
	onReorder,
	variant = 'default',
	size = 'md',
	showDragHandle = true,
	dragHandle,
	disabled = false,
	className,
	'aria-label': ariaLabel = 'Sortable list',
	...props
}: Readonly<SortableListProps<T>>) {
	const listId = useId();
	const classes = getListVariantClasses({ variant, className });

	const sortableListState = useSortableListConfig({
		items,
		onReorder,
		disabled,
	});

	const handlers = prepareItemHandlers(sortableListState);
	const renderedItems = renderSortableItems({
		items,
		draggedItemId: sortableListState.draggedItemId,
		dragTargetIndex: sortableListState.dragTargetIndex,
		showDragHandle,
		dragHandle,
		disabled,
		handlers,
		renderItem,
	});

	return (
		<ListProvider size={size}>
			<ul {...props} id={listId} className={classes} aria-label={ariaLabel}>
				{renderedItems}
			</ul>
		</ListProvider>
	);
}
